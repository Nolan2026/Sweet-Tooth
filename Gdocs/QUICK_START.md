# Quick Start Guide - Sweet Tooth Platform

Welcome! This guide will help you get started with the Sweet Tooth e-commerce platform.

---

## ⚡ Quick Setup (Development)

### 1. Prerequisites Check

Ensure you have:
- ✅ Node.js v16+ installed
- ✅ PostgreSQL 14+ installed and running
- ✅ Git installed

### 2. Clone & Install

```bash
# Clone the repository (if not already done)
cd "d:\Projects codes\Final_Sweet_Tooth"

# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install

# Install Admin Panel dependencies
cd ../AdminPanel
npm install
```

### 3. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE SweetTooth;

# Exit PostgreSQL
\q
```

### 4. Environment Configuration

```bash
cd Backend

# .env already exists, but verify these settings:
# DATABASE_URL="postgresql://username:password@localhost:5432/SweetTooth"
# JWT_SECRET="your_secure_random_secret_at_least_64_chars"  
# PORT=5016
# NODE_ENV=development
```

### 5. Run Database Migrations

```bash
cd Backend
npx prisma migrate dev
npx prisma generate
```

### 6. Start All Services

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
✅ Backend running on http://localhost:5016

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

**Terminal 3 - Admin Panel:**
```bash
cd AdminPanel
npm run dev
```
✅ Admin Panel running on http://localhost:3000

---

## 🔐 Security Features Enabled

Your application now has:

✅ **Input Validation** - All user inputs validated and sanitized  
✅ **Rate Limiting** - Protection against brute force attacks  
✅ **Security Headers** - XSS, Clickjacking, MIME sniffing protection  
✅ **Error Handling** - No sensitive information leaked  
✅ **CORS Protection** - Restricted to allowed origins  
✅ **Password Hashing** - Bcrypt with 10 salt rounds  
✅ **JWT Authentication** - Secure token-based auth  
✅ **SQL Injection Protection** - Prisma ORM  
✅ **File Upload Security** - Type and size validation  

---

## 📝 Important Files

### Configuration
- `Backend/.env` - Environment variables (DO NOT commit)
- `Backend/.env.example` - Template for environment setup
- `Backend/prisma/schema.prisma` - Database schema

### Documentation
- `README.md` - Main project documentation
- `docs/API_DOCUMENTATION.md` - Complete API reference
- `docs/DEPLOYMENT.md` - Production deployment guide
- `docs/SECURITY.md` - Security best practices
- `docs/DATABASE.md` - Database schema documentation
- `SECURITY_AUDIT.md` - Security improvements summary

### Security Middleware
- `Backend/src/middleware/validation/inputValidator.js`
- `Backend/src/middleware/security/rateLimiter.js`
- `Backend/src/middleware/security/securityHeaders.js`
- `Backend/src/middleware/error/errorHandler.js`

---

## 🧪 Testing the Security Features

### 1. Test Rate Limiting

Try logging in 6 times quickly:
```bash
# Should block on 6th attempt
curl -X POST http://localhost:5016/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
```

### 2. Test Input Validation

Try registering with weak password:
```bash
# Should fail validation
curl -X POST http://localhost:5016/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"weak"}'
```

### 3. Test Security Headers

```bash
curl -I http://localhost:5016/
# Look for X-Frame-Options, X-XSS-Protection, etc.
```

---

## 🚀 Next Steps

### For Development
1. Create test users via Frontend registration
2. Add products via Admin Panel → Add Item
3. Test order flow
4. Configure admin profile settings

### For Production
1. Read `docs/DEPLOYMENT.md` completely
2. Generate strong JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
3. Set up production database
4. Configure domain and SSL
5. Follow production deployment checklist

---

## 📚 Learn More

### Documentation Structure

```
Final_Sweet_Tooth/
├── README.md                    # Start here
├── SECURITY_AUDIT.md            # Security improvements summary
└── docs/
    ├── API_DOCUMENTATION.md     # API reference
    ├── DEPLOYMENT.md            # Production deployment
    ├── SECURITY.md              # Security best practices
    └── DATABASE.md              # Database schema
```

### Key Concepts

**Authentication Flow:**
1. User registers → Password hashed with bcrypt
2. User logs in → JWT token generated (24h expiry)
3. User makes requests → Token in Authorization header
4. Backend verifies token → User identified

**Order Flow:**
1. User adds items to cart
2. Cart validated with current prices
3. Order created with snapshot of items
4. Tracking ID generated
5. Admin can update order status

**Admin Features:**
- Manage products (CRUD operations)
- Process orders
- Track inventory
- Generate reports
- Manage coupons

---

## ⚠️ Common Issues

### Database Connection Failed
```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
# OR check Windows Services for PostgreSQL

# Verify DATABASE_URL in .env
```

### Port Already in Use
```bash
# Backend port 5016 in use
lsof -i :5016  # Linux/Mac
netstat -ano | findstr :5016  # Windows

# Kill the process and restart
```

### Migration Failed
```bash
# Reset database (DEVELOPMENT ONLY!)
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

### Module Not Found
```bash
# Reinstall dependencies
cd Backend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Development Workflow

### Daily Development
```bash
# 1. Pull latest changes
git pull

# 2. Check for new dependencies
npm install

# 3. Run migrations
npx prisma migrate dev

# 4. Start services
npm run dev
```

### Adding New Features
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation
5. Create pull request

### Before Committing
- [ ] Code works locally
- [ ] No console.errors
- [ ] .env not included
- [ ] Documentation updated
- [ ] No sensitive data in code

---

## 📞 Support

### Getting Help
1. Check this documentation
2. Review error logs
3. Check `docs/` for detailed guides
4. Open GitHub issue

### Useful Commands

**Backend:**
```bash
npm run dev          # Start development server
npx prisma studio    # Database GUI
npx prisma migrate dev  # Create & apply migration
```

**Frontend/Admin:**
```bash
npm run dev          # Start development server
npm run build        # Create production build
```

---

## ✅ Pre-Flight Checklist

Before starting development:
- [x] PostgreSQL running
- [x] Database created
- [x] Dependencies installed (Backend, Frontend, Admin)
- [x] .env file configured
- [x] Migrations applied
- [x] All three terminals ready
- [ ] Coffee/Tea prepared ☕

---

## 🎉 You're All Set!

Your Sweet Tooth platform is now:
- ✅ Fully functional
- ✅ Security hardened
- ✅ Production ready
- ✅ Well documented

**Start developing amazing features!** 🚀

---

For detailed information on any topic, refer to the respective documentation in `/docs`.

Happy coding! 💻✨
