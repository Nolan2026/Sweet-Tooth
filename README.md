# Sweet Tooth - E-Commerce Platform for Sweets & Snacks

<div align="center">

![Sweet Tooth Logo](./logo.png)

**A full-stack e-commerce platform for selling sweets and snacks online with comprehensive admin panel**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nod ejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D14.0-blue)](https://www.postgresql.org/)

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Customer Features
- 🛍️ Browse products by categories (Regular, Milk Sweets, Dry Fruit Sweets, Cool Sweets, Snacks)
- 🛒 Shopping cart with flexible weight selection (250g, 500g, 750g, 1kg)
- 👤 User authentication and profile management
- 📍 Advanced address management (Street, Area, District, Pin Code)
- 📦 Order tracking with unique tracking IDs
- 💰 Coupon code support for discounts
- 📱 Fully responsive design for mobile and desktop (95% optimized zoom)
- 📧 Contact form for customer inquiries
- 🌍 Global country support for shipping

### Admin Panel Features
- 📊 **High-density Order Management**: Optimized ultra-compact layout for status updates
- 📦 **Inventory Control**: Real-time stock management and availability toggles
- 💵 **Professional Billing**: Modern POS interface with print-optimized styles
- 👥 **Employee Tracking**: Attendance management and profile controls
- 🏷️ **Labels Hub**: High-contrast product and shipping labels with QR codes
- 💳 **UPI Integration**: Dynamic QR code generation for Scan & Pay (Admin Profile controlled)
- 🖨️ **Bill History**: One-click re-printing of historical bills with professional layout
- 🗑️ **POS Controls**: "Clear All" functionality for fast billing reset
- 📱 **Responsive Dashboard**: Fully functional on mobile, tablet, and desktop (95% zoom layout)
- 🎨 **Unified Design**: Standardized button sizes and high-contrast data visualization
- 📜 **Audit History**: Detailed logging for orders, bills, and messages

---

## 🛠️ Tech Stack

### Frontend & Admin
- **React 18** with **Vite** (HMR enabled)
- **Redux Toolkit** for sophisticated state management
- **React Router 6** for seamless navigation
- **Axios** with centralized API configuration
- **Vanilla CSS3** with modern design tokens and utility patterns

### Backend
- **Node.js** (v16+) with **Express.js**
- **Prisma ORM** for type-safe database interactions
- **PostgreSQL** for reliable data persistence
- **JWT** (JSON Web Tokens) for stateless authentication
- **bcryptjs** (10 salt rounds) for industry-standard security

### 🛡️ Security (Production Ready)
- **Helmet**: Integrated security headers (XSS, Clickjacking, CSP)
- **HPP**: Protection against HTTP Parameter Pollution
- **Rate Limiting**: Tiered limits for Auth and General API routes
- **Payload Sanitization**: 10KB strict request body limits
- **Fail-Safe Startup**: Production checks for critical env variables
- **Endpoint Audit**: Removed all debug/test routes for deployment

---

## 📁 Project Structure

```
Final_Sweet_Tooth/
│
├── Backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── routers/
│   │   │   ├── landingRoutes/  # Public API routes
│   │   │   │   ├── auth.js     # Authentication
│   │   │   │   ├── items.js    # Products
│   │   │   │   ├── order.js    # Orders
│   │   │   │   ├── user.js     # User profile
│   │   │   │   ├── contact.js  # Contact form
│   │   │   │   └── coupons.js  # Coupon validation
│   │   │   ├── adminRoutes/    # Admin API routes
│   │   │   │   ├── orders.js
│   │   │   │   ├── inventory.js
│   │   │   │   ├── billing.js
│   │   │   │   ├── attendance.js
│   │   │   │   ├── messages.js
│   │   │   │   ├── coupons.js
│   │   │   │   └── adminprofile.js
│   │   │   └── uploadsRoutes/
│   │   │       └── upload.js   # File uploads
│   │   ├── middleware/
│   │   │   ├── authentication/
│   │   │   │   ├── auth.js
│   │   │   │   ├── adminAuth.js
│   │   │   │   └── trakingId.js
│   │   │   ├── validation/
│   │   │   │   └── inputValidator.js
│   │   │   ├── security/
│   │   │   │   ├── rateLimiter.js
│   │   │   │   └── securityHeaders.js
│   │   │   └── error/
│   │   │       └── errorHandler.js
│   │   ├── media/
│   │   │   └── Images.js       # Multer configuration
│   │   ├── server.js           # Main server file
│   │   └── prismaClient.js     # Database client
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── uploads/                # Uploaded images
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── README.md
│
├── Frontend/                   # Customer-facing website
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── Store/              # Redux store
│   │   └── api/
│   ├── public/
│   └── index.html
│
└── AdminPanel/                 # Admin dashboard
    ├── src/
    │   ├── Pages/
    │   ├── Component/
    │   ├── Store/
    │   ├── styles/
    │   └── api/
    └── index.html
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 16.0.0 ([Download](https://nodejs.org/))
- **PostgreSQL** >= 14.0 ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager
- **Git** for version control

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sweet-tooth.git
cd sweet-tooth
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

### 4. Admin Panel Setup

```bash
cd ../AdminPanel
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. **Create Environment File**

```bash
cd Backend
cp .env.example .env
```

2. **Configure `.env` File**

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/SweetTooth"

# JWT Secret - Generate a secure random key
JWT_SECRET="your_super_secure_random_secret_key_here"

# Server Configuration
PORT=5016
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR="uploads"
```

**🔐 Generate Secure JWT Secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. **Database Setup**

Create a PostgreSQL database:

```sql
CREATE DATABASE SweetTooth;
```

4. **Run Database Migrations**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Frontend Configuration

Create `.env` file in `Frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5016
```

### Admin Panel Configuration

Create `.env` file in `AdminPanel/`:

```env
VITE_API_BASE_URL=http://localhost:5016
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

**Terminal 3 - Admin Panel:**
```bash
cd AdminPanel
npm run dev
```

### Access the Applications

- **Frontend (Customer Site):** http://localhost:5173
- **Admin Panel:** http://localhost:3000
- **Backend API:** http://localhost:5016

---

## 📚 API Documentation

See [PUBLIC_API.md](./Gdocs/PUBLIC_API.md) for public API reference.

> **Note:** Complete internal API documentation (including admin endpoints) is available in 
> `Gdocs/API_DOCUMENTATION.md` but should NOT be deployed publicly for security reasons.

---

## 🔒 Security

This application implements multiple layers of security:

### Authentication & Authorization
- **JWT-based authentication**: Secure token-based access.
- **Secure password hashing**: Using `bcryptjs` for all user and admin passwords.
- **Token expiration**: Short-lived tokens to minimize risk.
- **Admin Verification**: Dedicated middleware for admin-only routes.

### Input Protection
- **Server-side validation**: Robust validation for all inputs via `inputValidator.js`.
- **CORS restricted**: Only allowed origins can access the API.
- **Sanitization**: Protection against XSS and injection attacks.
- **SQL Injection protection**: Guaranteed by Prisma ORM.

### Rate Limiting & DoS Protection
- **Authentication endpoints**: Stricter limits (10 attempts per 15 minutes).
- **API endpoints**: 100 requests per minute per IP.
- **Payload limits**: Restricted JSON body size to prevent memory exhaustion.

### Security Headers (Helmet)
- **Content Security Policy (CSP)**
- **X-Frame-Options (Clickjacking protection)**
- **X-Content-Type-Options (MIME sniffing protection)**
- **X-XSS-Protection**
- **Strict-Transport-Security (HSTS)**

### Best Practices
- **Environment variables**: All secrets are stored in `.env` (never committed).
- **No data leakage**: Generic error messages to prevent information disclosure.
- **HTTPS Enforcement**: Recommended for all production deployments.

---

## 🌐 Deployment

See [DEPLOYMENT.md](./Gdocs/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT_SECRET
- [ ] Configure production database
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up file upload storage (S3/Cloud Storage)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up process manager (PM2)
- [ ] Enable database backups
- [ ] Configure logging and monitoring

---

## 🙏 Acknowledgments

- Icons from Font Awesome
- UI inspiration from modern e-commerce platforms
- Community contributors

---

<div align="center">

**Made with ❤️ for sweet tooth lovers**

</div>
