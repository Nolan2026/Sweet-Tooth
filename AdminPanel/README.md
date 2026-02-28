# Sweet Tooth - Admin Panel

This is the administrative interface for the Sweet Tooth e-commerce platform. It allows administrators to manage products, orders, customers, and business settings.

## 🚀 Features
- **Dashboard**: Overview of orders and revenue.
- **Order Management**: Process and update order statuses.
- **Inventory Control**: Add, edit, and toggle product availability.
- **Billing**: Manage in-store sales and billing.
- **Employee Management**: Track attendance and employee details.
- **Reports**: Generate business reports and summaries.

## 🛠️ Getting Started

### Prerequisites
- Node.js v16+
- Backend service running at `http://localhost:5016` (configure in `.env`)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5016
   ```
3. Run in development:
   ```bash
   npm run dev
   ```

## 🏗️ Building for Production
```bash
npm run build
```
The production-ready files will be in the `/dist` directory.

## 🔒 Security
- Authentication required via Admin JWT token.
- Role-based access control implemented on the backend.
- Secure API communication via Axios.
