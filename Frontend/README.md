# Sweet Tooth - Frontend

This is the customer-facing website for the Sweet Tooth e-commerce platform. It provides a seamless shopping experience for browsing and ordering sweets and snacks.

## 🛍️ Features
- **Product Catalog**: Browse products by categories with detailed information.
- **Weight Selection**: 250g, 500g, 1kg options for products.
- **Shopping Cart**: Manage items and quantities before checkout.
- **Secure Checkout**: Order validation and creation.
- **User Profiles**: Manage addresses and view order history.
- **Responsive Design**: Optimized for mobile and desktop devices.

## 🛠️ Getting Started

### Prerequisites
- Node.js v16+
- Backend service running at `http://localhost:5016`

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
- JWT-based authentication for user features.
- Secure API calls via Axios.
- Input validation on all customer forms.
