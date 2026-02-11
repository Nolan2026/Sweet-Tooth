# Deployment Guide - Sweet Tooth Platform

This guide covers deploying the Sweet Tooth e-commerce platform to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Deployment](#database-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Admin Panel Deployment](#admin-panel-deployment)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All tests pass
- [ ] Security audit completed
- [ ] Strong JWT secret generated
- [ ] Production database configured
- [ ] SSL/TLS certificates obtained
- [ ] Domain names configured
- [ ] CORS settings reviewed
- [ ] Environment variables secured
- [ ] File upload storage configured
- [ ] Backup strategy in place
- [ ] Monitoring tools setup
- [ ] Error logging configured

---

## Environment Setup

### 1. Server Requirements

**Minimum Requirements:**
- OS: Ubuntu 20.04 LTS or later
- RAM: 2GB (4GB recommended)
- CPU: 2 cores
- Storage: 20GB SSD
- Node.js: v16 or later
- PostgreSQL: v14 or later

### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

---

## Database Deployment

### 1. PostgreSQL Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE SweetTooth;

# Create user with password
CREATE USER sweettooth_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE SweetTooth TO sweettooth_user;

# Exit
\q
```

### 2. Configure PostgreSQL for Remote Access (if needed)

Edit `/etc/postgresql/14/main/postgresql.conf`:
```
listen_addresses = 'localhost'  # Keep localhost for security
```

Edit `/etc/postgresql/14/main/pg_hba.conf`:
```
# Add your application server IP
host    SweetTooth    sweettooth_user    <app_server_ip>/32    md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 3. Backup Configuration

Create backup script `/home/backups/db_backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/backups/database"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
DB_NAME="SweetTooth"
DB_USER="sweettooth_user"

mkdir -p $BACKUP_DIR
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

Schedule with cron:
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/backups/db_backup.sh
```

---

## Backend Deployment

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/yourusername/sweet-tooth.git
cd sweet-tooth/Backend
```

### 2. Install Dependencies

```bash
npm install --production
```

### 3. Configure Environment

Create `/var/www/sweet-tooth/Backend/.env`:

```env
# Production Environment
NODE_ENV=production

# Database
DATABASE_URL="postgresql://sweettooth_user:your_secure_password@localhost:5432/SweetTooth"

# JWT Secret - Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your_production_jwt_secret_64_characters_minimum"

# Server
PORT=5016

# CORS - Your frontend domains
ALLOWED_ORIGINS="https://yourdomain.com,https://admin.yourdomain.com"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="uploads"
```

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Setup PM2

Create `/var/www/sweet-tooth/Backend/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'sweet-tooth-backend',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/var/log/pm2/sweet-tooth-error.log',
    out_file: '/var/log/pm2/sweet-tooth-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '500M',
    autorestart: true,
    watch: false
  }]
};
```

Start the application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/sweet-tooth-api`:

```nginx
upstream backend {
    server 127.0.0.1:5016;
    keepalive 64;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # File upload size limit
    client_max_body_size 10M;

    # Serving uploaded files
    location /uploads/ {
        alias /var/www/sweet-tooth/Backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API endpoints
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/sweet-tooth-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate Setup

Using Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

Auto-renewal is configured by default. Test with:
```bash
sudo certbot renew --dry-run
```

---

## Frontend Deployment

### 1. Build for Production

```bash
cd /var/www/sweet-tooth/Frontend

# Install dependencies
npm install

# Create production build
npm run build
```

### 2. Configure Nginx

Create `/etc/nginx/sites-available/sweet-tooth-frontend`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    root /var/www/sweet-tooth/Frontend/dist;
    index index.html;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/sweet-tooth-frontend /etc/nginx/sites-enabled/
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo nginx -t
sudo systemctl restart nginx
```

---

## Admin Panel Deployment

Same process as Frontend, but with different domain:

```bash
cd /var/www/sweet-tooth/AdminPanel
npm install
npm run build
```

Configure Nginx for `admin.yourdomain.com` following the same pattern as frontend.

---

## Post-Deployment

### 1. File Permissions

```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/sweet-tooth

# Set permissions
sudo find /var/www/sweet-tooth -type d -exec chmod 755 {} \;
sudo find /var/www/sweet-tooth -type f -exec chmod 644 {} \;

# Make uploads directory writable
sudo chmod 775 /var/www/sweet-tooth/Backend/uploads
```

### 2. Firewall Configuration

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Database Optimization

```bash
# Enable query logging for monitoring
sudo -u postgres psql -d SweetTooth

ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
SELECT pg_reload_conf();

# Create indexes for better performance
CREATE INDEX idx_orders_user_id ON "Order"("userId");
CREATE INDEX idx_orders_status ON "Order"("status");
CREATE INDEX idx_orders_created_at ON "Order"("createdAt");
CREATE INDEX idx_items_category ON "Item"("category");
```

---

## Monitoring & Maintenance

### 1. PM2 Monitoring

```bash
# View logs
pm2 logs

# Monitor resources
pm2 monit

# View process info
pm2 info sweet-tooth-backend
```

### 2. Log Rotation

Configure logrotate for PM2 logs `/etc/logrotate.d/pm2`:

```
/var/log/pm2/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. Health Check Script

Create `/home/monitoring/health_check.sh`:

```bash
#!/bin/bash

# Check if backend is responding
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.yourdomain.com/)

if [ $RESPONSE != "200" ]; then
    echo "Backend is down! HTTP Status: $RESPONSE"
    pm2 restart sweet-tooth-backend
    # Send alert (configure email/SMS)
fi
```

Schedule with cron:
```bash
*/5 * * * * /home/monitoring/health_check.sh
```

### 4. Database Monitoring

Monitor database size and performance:

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('SweetTooth'));

-- Table sizes
SELECT
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name)))
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;

-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Slow queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '5 seconds';
```

### 5. Backup Verification

Regularly test your backups:

```bash
# Restore to test database
gunzip -c backup_2026-02-11.sql.gz | psql -U sweettooth_user SweetTooth_test
```

---

## Deployment Automation (Optional)

### GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/sweet-tooth
            git pull origin main
            cd Backend
            npm install --production
            npx prisma migrate deploy
            pm2 restart sweet-tooth-backend
```

---

## Troubleshooting

### Backend Won't Start

```bash
# Check PM2 logs
pm2 logs sweet-tooth-backend --lines 100

# Check if port is in use
sudo lsof -i :5016

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Issues

```bash
# Test database connection
psql -U sweettooth_user -d SweetTooth -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### SSL Certificate Issues

```bash
# Test SSL
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal
```

---

## Security Checklist

- [ ] HTTPS enabled on all domains
- [ ] Strong passwords for database
- [ ] JWT_SECRET is 64+ random characters
- [ ] File upload directory is not executable
- [ ] Regular security updates applied
- [ ] Rate limiting enabled
- [ ] Firewall configured
- [ ] Fail2ban installed (optional)
- [ ] Regular backups automated
- [ ] Error messages don't leak sensitive info
- [ ] Admin panel uses separate subdomain
- [ ] CORS properly configured
- [ ] Database user has minimum required permissions

---

## Performance Optimization

1. **Enable Nginx caching** for static assets
2. **Use CDN** for images (Cloudflare, AWS CloudFront)
3. **Enable database connection pooling**
4. **Implement Redis caching** for frequently accessed data
5. **Optimize database queries** with proper indexes
6. **Enable Gzip compression**
7. **Lazy load images** on frontend
8. **Minify CSS/JS** (done automatically in build)

---

## Need Help?

- Check logs first
- Review this documentation
- Contact development team
- Open issue on GitHub

---

**Happy Deploying! 🚀**
