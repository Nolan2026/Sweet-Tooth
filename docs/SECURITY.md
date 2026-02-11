# Security Best Practices - Sweet Tooth Platform

This document outlines the security measures implemented in the Sweet Tooth platform and best practices for maintaining security.

---

## 🔒 Security Layers

### 1. Authentication & Authorization

#### JWT-Based Authentication
- **Token Expiration**: 24 hours
- **Secure Secret**: 64+ character random string
- **Algorithm**: HS256
- **Storage**: Client-side localStorage (HTTPS only in production)

**Implementation:**
```javascript
const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);
```

#### Admin Separation
- Separate authentication middleware for admin routes
- Admin routes protected with `authenticateAdmin` middleware
- No admin flag in regular user tokens (security through obscurity avoided)

---

### 2. Password Security

#### Hashing
- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Auto-salting**: Enabled

```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

#### Password Requirements
- Minimum 8 characters
- At least one letter
- At least one number
- Special characters recommended but not enforced

**Validation Regex:**
```javascript
/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
```

---

### 3. Input Validation

#### Server-Side Validation

All user inputs are validated on the server using middleware:

```javascript
// Email validation
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Username: 3-30 alphanumeric + underscores
/^[a-zA-Z0-9_]{3,30}$/

// Phone: 10-15 digits with optional formatting
/^[\d\s\-\+\(\)]{10,15}$/
```

#### Sanitization
- Trim whitespace
- Remove HTML tags (`< >`)
- Convert emails to lowercase
- Validate IDs as positive integers

---

### 4. SQL Injection Protection

#### Prisma ORM
- **Parameterized Queries**: All queries use Prisma's built-in protection
- **Type Safety**: TypeScript-like type checking
- **No Raw SQL**: Avoid `$queryRaw` except for database health checks

**Safe Example:**
```javascript
await prisma.user.findUnique({
    where: { email: userInput } // Automatically escaped
});
```

---

### 5. XSS Protection

#### Server-Side
- Security headers with `X-XSS-Protection: 1; mode=block`
- Content Security Policy configured
- Input sanitization removes `< >` characters

#### Client-Side
- React's built-in XSS protection (escapes content)
- No `dangerouslySetInnerHTML` usage
- User-generated content escaped

---

### 6. CSRF Protection

#### SameSite Cookies
While we use localStorage for tokens, production should consider:

```javascript
res.cookie('token', jwt, {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict'
});
```

#### CORS Configuration
```javascript
cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
})
```

---

### 7. Rate Limiting

#### Implementation

**Authentication Routes:** 5 requests per 15 minutes
```javascript
authLimiter = createRateLimiter(5, 900000)
```

**API Routes:** 100 requests per minute
```javascript
apiLimiter = createRateLimiter(100, 60000)
```

#### Features
- IP-based tracking
- Automatic window reset
- Retry-After header on limit exceed
- Memory-based (suitable for single-server deployments)

**Production Recommendation:** Use Redis for distributed rate limiting

---

### 8. File Upload Security

#### Restrictions
- **Allowed Types**: Images only (`image/`)
- **Size Limit**: 5MB
- **Filename**: Sanitized with timestamp
- **Storage**: Local filesystem (uploads/)

```javascript
const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});
```

#### Best Practices
- ✅ Validate file type on both client and server
- ✅ Rename files to prevent overwriting
- ✅ Store outside web root
- ✅ Serve through separate route
- ❌ Never execute uploaded files
- ❌ Don't trust client-provided filenames

---

### 9. Security Headers

```javascript
X-Frame-Options: DENY                    // Clickjacking protection
X-Content-Type-Options: nosniff           // MIME sniffing protection
X-XSS-Protection: 1; mode=block           // XSS filter
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000 (Production only)
```

---

### 10. Error Handling

#### Information Leakage Prevention

**Development:**
```json
{
    "message": "Error occurred",
    "error": {
        "message": "Detailed error",
        "stack": "Full stack trace"
    }
}
```

**Production:**
```json
{
    "success": false,
    "message": "Internal server error"
}
```

#### Logging
- Errors logged server-side with full details
- Client receives generic message
- No database schema or file paths exposed

---

### 11. Database Security

#### Connection
- Use connection pooling
- Limit max connections
- Use read-only user for SELECT operations (future improvement)

```javascript
const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 20  // Maximum 20 connections
});
```

#### User Permissions
```sql
-- Create app user with limited permissions
CREATE USER sweettooth_app WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE SweetTooth TO sweettooth_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO sweettooth_app;
REVOKE ALL ON DATABASE postgres FROM sweettooth_app;  -- No access to other DBs
```

---

### 12. Environment Variables

#### Required Variables
```env
JWT_SECRET          # Must be 64+ random characters
DATABASE_URL        # Never commit to git
NODE_ENV            # Set to 'production' in production
ALLOWED_ORIGINS     # Restrict CORS
```

#### Security Rules
- ✅ Use `.env.example` template
- ✅ Keep `.env` in `.gitignore`
- ✅ Use different secrets for dev/prod
- ✅ Rotate secrets regularly
- ❌ Never hardcode secrets
- ❌ Never commit `.env` to git

#### Generating Secure Secrets
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Random Password
openssl rand  -base64 32
```

---

### 13. HTTPS/SSL

#### Production Requirements
- SSL certificate from Let's Encrypt (free)
- TLS 1.2 minimum, TLS 1.3 preferred
- Strong cipher suites
- HSTS enabled

#### Nginx SSL Configuration
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

### 14. API Security

#### Authentication Header
```
Authorization: Bearer <jwt_token>
```

#### Request Validation
- Check token on every protected route
- Verify token signature
- Check expiration
- Validate user still exists

#### Response Security
- No passwords in responses
- Sensitive data excluded
- Consistent error messages (no user enumeration)

---

### 15. Admin Panel Security

#### Access Control
- Separate subdomain (admin.yourdomain.com)
- Separate authentication
- Rate limiting (stricter than public API)
- IP whitelisting (optional, recommended)

#### Audit Logging
Track admin actions:
- Who performed the action
- What action was performed
- When it occurred
- IP address

**Future Enhancement:**
```javascript
await prisma.auditLog.create({
    data: {
        adminId: req.user.id,
        action: 'DELETE_ORDER',
        details: { orderId: 123 },
        ipAddress: req.ip,
        timestamp: new Date()
    }
});
```

---

## 🚨 Common Vulnerabilities & Mitigations

### 1. SQL Injection
- **Risk**: Manipulating database queries
- **Mitigation**: Using Prisma ORM, parameterized queries
- **Status**: ✅ Protected

### 2. XSS (Cross-Site Scripting)
- **Risk**: Injecting malicious scripts
- **Mitigation**: React escaping, CSP headers, input sanitization
- **Status**: ✅ Protected

### 3. CSRF (Cross-Site Request Forgery)
- **Risk**: Unauthorized actions from authenticated users
- **Mitigation**: CORS restrictions, SameSite cookies
- **Status**: ⚠️ Partial (consider CSRF tokens)

### 4. Brute Force Attacks
- **Risk**: Password guessing attacks
- **Mitigation**: Rate limiting on auth endpoints
- **Status**: ✅ Protected

### 5. Information Disclosure
- **Risk**: Leaking sensitive data
- **Mitigation**: Error handler, password exclusion, environment variables
- **Status**: ✅ Protected

### 6. Insecure Direct Object References
- **Risk**: Accessing unauthorized resources
- **Mitigation**: User ID from JWT, not from request
- **Status**: ⚠️ Verify on all routes

### 7. Security Misconfiguration
- **Risk**: Default settings, unnecessary features
- **Mitigation**: Production environment variables, security headers
- **Status**: ✅ Configured

### 8. Sensitive Data Exposure
- **Risk**: Unencrypted data transmission
- **Mitigation**: HTTPS, password hashing
- **Status**: ✅ Protected (HTTPS required in prod)

---

## 🛡️ Security Checklist

### Pre-Production
- [ ] All dependencies updated (`npm audit`)
- [ ] Strong JWT_SECRET generated
- [ ] DATABASE_URL secured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting tested
- [ ] File upload restrictions verified
- [ ] Error messages sanitized
- [ ] Admin routes protected
- [ ] Input validation on all endpoints

### Production
- [ ] Environment variables secured
- [ ] Database backups automated
- [ ] Monitoring enabled
- [ ] Logs configured
- [ ] Firewall rules set
- [ ] SSL certificate auto-renewal
- [ ] Security headers verified
- [ ] Uploads directory not executable
- [ ] Database user has minimum permissions
- [ ] Regular security audits scheduled

---

## 📊 Security Monitoring

### Key Metrics
1. **Failed login attempts**: Monitor for brute force
2. **Rate limit hits**: Identify abuse patterns
3. **Error rates**: Detect attacks or issues
4. **File upload failures**: Monitor for malicious uploads
5. **Database query times**: Detect SQL injection attempts

### Tools
- PM2 for process monitoring
- PostgreSQL logs for database monitoring
- Nginx access/error logs
- Custom health check scripts

---

## 🔄 Regular Maintenance

### Weekly
- Review error logs
- Check failed login attempts
- Monitor resource usage

### Monthly
- Update dependencies (`npm update`)
- Review security patches
- Test backup restoration
- Audit admin actions

### Quarterly
- Security audit
- Penetration testing
- Review and rotate secrets
- Update SSL certificates (if not auto-renewed)

---

## 🚀 Future Security Enhancements

1. **Two-Factor Authentication (2FA)**
   - SMS/Email verification
   - TOTP authenticator app support

2. **Session Management**
   - Active session tracking
   - Remote logout capability
   - Session timeout

3. **Advanced Rate Limiting**
   - Redis-based distributed limiting
   - Adaptive rate limiting
   - Bot detection

4. **Content Security**
   - Image scanning for malware
   - Content moderation for user uploads
   - Watermarking

5. **Compliance**
   - GDPR compliance (data export, deletion)
   - Cookie consent
   - Privacy policy enforcement

6. **Audit Logging**
   - Comprehensive admin action logs
   - User activity tracking
   - Anomaly detection

---

## 📞 Security Incident Response

### If You Detect a Security Issue:

1. **Immediate Actions**
   - Document the issue
   - Assess impact
   - Isolate affected systems

2. **Investigation**
   - Review logs
   - Identify attack vector
   - Determine data exposure

3. **Mitigation**
   - Patch vulnerability
   - Reset compromised credentials
   - Notify affected users (if required)

4. **Prevention**
   - Update security measures
   - Document lessons learned
   - Improve monitoring

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Prisma Security](https://www.prisma.io/docs/guides/database/advanced-database-tasks/sql-injection)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Remember: Security is an ongoing process, not a one-time task!** 🔐
