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
- 📍 Multiple address management
- 📦 Order tracking with unique tracking IDs
- 💰 Coupon code support for discounts
- 📱 Fully responsive design for mobile and desktop
- 📧 Contact form for customer inquiries

### Admin Panel Features
- 📊 Order management and status updates
- 📦 Inventory management with stock control
- 💵 Billing system with payment mode tracking
- 👥 Employee management and attendance tracking
- 🏷️ Product label printing
- 📮 Shipping label generation with barcodes
- 💬 Customer message management
- 🎟️ Coupon creation and management
- 📈 Business profile and branding customization
- 📜 Order history and reports

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.x with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

### Backend
- **Node.js** (v16+)
- **Express.js** for REST API
- **Prisma ORM** for database management
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

### Security
- Rate limiting
- CORS protection
- Security headers (XSS, Clickjacking, etc.)
- Input validation and sanitization
- Error handling without information leakage

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

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for complete API reference.

### Quick Reference

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

#### Products
- `GET /items` - Get all items
- `GET /items/:id` - Get item by ID
- `POST /items` - Add new item (Admin)
- `PUT /items/:id` - Update item (Admin)
- `DELETE /items/:id` - Delete item (Admin)

#### Orders
- `POST /order/validate` - Validate cart
- `POST /order/create` - Create order
- `GET /order/my-orders` - Get user orders
- `DELETE /order/cancel/:id` - Cancel order

#### User Profile
- `GET /user/profile` - Get user profile
- `POST /user/address` - Add/Update address
- `DELETE /user/address/:id` - Delete address

---

## 🔒 Security

This application implements multiple layers of security:

### Authentication & Authorization
- JWT-based authentication
- Secure password hashing using bcryptjs
- Token expiration (24 hours)
- Separate admin authentication

### Input Validation
- Server-side validation for all inputs
- Email format validation
- Password strength requirements
- SQL injection protection via Prisma ORM

### Rate Limiting
- Authentication endpoints: 5 attempts per 15 minutes
- API endpoints: 100 requests per minute
- Protection against brute force attacks

### Security Headers
- XSS Protection
- Clickjacking Prevention
- MIME Type Sniffing Prevention
- Content Security Policy
- HTTPS enforcement in production

### Data Protection
- Sensitive data excluded from responses
- Error messages don't leak system information
- CORS restricted to allowed origins
- File upload validation and size limits

### Best Practices
- Environment variables for sensitive data
- Secure session management
- Regular dependency updates
- Audit logs for admin actions

---

## 🌐 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

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

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 📞 Support

For support, email support@sweettooth.com or open an issue in the repository.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Icons from Font Awesome
- UI inspiration from modern e-commerce platforms
- Community contributors

---

<div align="center">

**Made with ❤️ for sweet tooth lovers**

</div>
