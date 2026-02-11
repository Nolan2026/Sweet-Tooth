# API Documentation - Sweet Tooth Platform

## Base URL

```
Development: http://localhost:5016
Production: https://api.yourdomain.com
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Items/Products](#items-endpoints)
3. [Orders](#orders-endpoints)
4. [User Profile](#user-profile-endpoints)
5. [Contact](#contact-endpoints)
6. [Coupons](#coupons-endpoints)
7. [Admin - Orders](#admin-orders-endpoints)
8. [Admin - Inventory](#admin-inventory-endpoints)
9. [Admin - Billing](#admin-billing-endpoints)
10. [Admin - Attendance](#admin-attendance-endpoints)
11. [Admin - Messages](#admin-messages-endpoints)
12. [Admin - Coupons](#admin-coupons-endpoints)
13. [File Uploads](#file-upload-endpoints)
14. [Error Responses](#error-responses)

---

## Authentication Endpoints

### Register User

Creates a new user account.

**Endpoint:** `POST /auth/register`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "1234567890"
}
```

**Validation Rules:**
- `username`: 3-30 characters, alphanumeric with underscores
- `email`: Valid email format
- `password`: Minimum 8 characters, at least one letter and one number
- `phone`: Optional, 10-15 digits

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `409 Conflict`: Username or email already exists

---

### User Login

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /auth/login`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

---

## Items Endpoints

### Get All Items

Retrieves all products in the catalog.

**Endpoint:** `GET /items`

**Rate Limit:** 100 requests per minute

**Authentication:** Not required

**Success Response (200):**
```json
[
  {
    "id": 1,
    "category": "Regular",
    "item_name": "Gulab Jamun",
    "price": 200,
    "image_url": "/uploads/image-1234567890.jpg",
    "availability": true,
    "kilo_grams": true
  },
  {
    "id": 2,
    "category": "MilkSweets",
    "item_name": "Rasgulla",
    "price": 180,
    "image_url": "/uploads/image-0987654321.jpg",
    "availability": true,
    "kilo_grams": true
  }
]
```

---

### Get Item by ID

Retrieves a single product by its ID.

**Endpoint:** `GET /items/:id`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "id": 1,
  "category": "Regular",
  "item_name": "Gulab Jamun",
  "price": 200,
  "image_url": "/uploads/image-1234567890.jpg",
  "availability": true,
  "kilo_grams": true
}
```

**Error Responses:**
- `404 Not Found`: Item doesn't exist

---

### Add New Item (Admin Only)

Creates a new product.

**Endpoint:** `POST /items`

**Authentication:** Admin token required

**Content-Type:** `multipart/form-data`

**Request Body:**
```
category: "Regular"
item_name: "Gulab Jamun"
price: 200
image: [File]
```

**Success Response (201):**
```json
{
  "id": 1,
  "category": "Regular",
  "item_name": "Gulab Jamun",
  "price": 200,
  "image_url": "/uploads/image-1234567890.jpg",
  "availability": true,
  "kilo_grams": true
}
```

---

### Update Item (Admin Only)

Updates an existing product.

**Endpoint:** `PUT /items/:id`

**Authentication:** Admin token required

**Content-Type:** `multipart/form-data`

**Request Body (all fields optional):**
```
item_name: "Updated Name"
price: 250
availability: true
image: [File]
```

**Success Response (200):**
```json
{
  "id": 1,
  "category": "Regular",
  "item_name": "Updated Name",
  "price": 250,
  "image_url": "/uploads/image-new.jpg",
  "availability": true,
  "kilo_grams": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid data
- `404 Not Found`: Item doesn't exist

---

### Delete Item (Admin Only)

Deletes a product.

**Endpoint:** `DELETE /items/:id`

**Authentication:** Admin token required

**Success Response (200):**
```json
{
  "message": "Item deleted successfully"
}
```

---

## Orders Endpoints

### Validate Cart

Validates cart items and calculates current prices from database.

**Endpoint:** `POST /order/validate`

**Authentication:** Required

**Request Body:**
```json
{
  "cartItems": [
    {
      "id": 1,
      "quantity": 2,
      "selectedWeight": 0.5
    },
    {
      "id": 2,
      "quantity": 1,
      "selectedWeight": 1
    }
  ]
}
```

**Success Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "quantity": 2,
      "selectedWeight": 0.5,
      "dbPrice": 200,
      "confirmedPrice": 100,
      "subtotal": 200
    }
  ],
  "total": 380
}
```

---

### Create Order

Creates a new order for the authenticated user.

**Endpoint:** `POST /order/create`

**Authentication:** Required

**Request Body:**
```json
{
  "cartItems": [
    {
      "id": 1,
      "quantity": 2,
      "selectedWeight": 0.5
    }
  ],
  "total": 200,
  "couponCode": "SAVE10"
}
```

**Success Response (201):**
```json
{
  "message": "Order created successfully",
  "orderId": 123,
  "total": 200
}
```

**Error Responses:**
- `400 Bad Request`: Cart is empty or address not found
- `404 Not Found`: Item not found

---

### Get My Orders

Retrieves all orders for the authenticated user.

**Endpoint:** `GET /order/my-orders`

**Authentication:** Required

**Success Response (200):**
```json
[
  {
    "id": 123,
    "userId": 1,
    "total": 200,
    "status": "Pending",
    "items": [
      {
        "id": 1,
        "name": "Gulab Jamun",
        "weight": 0.5,
        "quantity": 2,
        "pricePerUnit": 100,
        "subtotal": 200
      }
    ],
    "trackingId": "ST-1234567890",
    "createdAt": "2026-02-11T16:00:00.000Z"
  }
]
```

---

### Cancel Order

Cancels a pending order.

**Endpoint:** `DELETE /order/cancel/:id`

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Order cancelled successfully"
}
```

**Error Responses:**
- `403 Forbidden`: Not authorized to cancel this order
- `400 Bad Request`: Order cannot be cancelled (already delivered/cancelled)
- `404 Not Found`: Order not found

---

## User Profile Endpoints

### Get User Profile

Retrieves the authenticated user's profile with addresses and orders.

**Endpoint:** `GET /user/profile`

**Authentication:** Required

**Success Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "addresses": [
    {
      "id": 1,
      "label": "Home",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    }
  ],
  "orders": [...]
}
```

---

### Add/Update Address

Adds a new address or updates an existing one.

**Endpoint:** `POST /user/address`

**Authentication:** Required

**Request Body (Create):**
```json
{
  "label": "Home",
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India"
}
```

**Request Body (Update):**
```json
{
  "id": 1,
  "label": "Office",
  "street": "456 Business Park",
  "city": "Delhi",
  "state": "Delhi",
  "zipCode": "110001",
  "country": "India"
}
```

**Success Response (200):**
```json
{
  "message": "Address added",
  "address": {
    "id": 1,
    "label": "Home",
    "userId": 1,
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

---

### Delete Address

Deletes an address.

**Endpoint:** `DELETE /user/address/:id`

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Address deleted successfully"
}
```

---

## Contact Endpoints

### Submit Contact Form

Submits a contact/inquiry message.

**Endpoint:** `POST /contact`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Product Inquiry",
  "message": "I would like to know more about..."
}
```

**Success Response (201):**
```json
{
  "message": "Message sent successfully",
  "contact": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Product Inquiry",
    "message": "I would like to know more about...",
    "createdAt": "2026-02-11T16:00:00.000Z"
  }
}
```

---

## Coupons Endpoints

### Validate Coupon

Validates a coupon code.

**Endpoint:** `POST /coupons/validate`

**Authentication:** Not required

**Request Body:**
```json
{
  "code": "SAVE10",
  "orderValue": 500
}
```

**Success Response (200):**
```json
{
  "valid": true,
  "coupon": {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountValue": 10,
    "minOrderValue": 200
  },
  "discount": 50
}
```

**Error Response (400):**
```json
{
  "valid": false,
  "message": "Coupon expired"
}
```

---

## Admin Orders Endpoints

All admin endpoints require admin authentication.

### Get All Orders

**Endpoint:** `GET /admin/orders`

**Query Parameters:**
- `status`: Filter by status (Pending, Delivered, Cancelled)
- `startDate`: Filter by start date (ISO format)
- `endDate`: Filter by end date (ISO format)

**Example:** `GET /admin/orders?status=Pending&startDate=2026-02-01`

**Success Response (200):**
```json
[
  {
    "id": 123,
    "userId": 1,
    "total": 200,
    "status": "Pending",
    "items": [...],
    "trackingId": "ST-1234567890",
    "createdAt": "2026-02-11T16:00:00.000Z",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "addresses": [...]
    }
  }
]
```

---

### Update Order Status

**Endpoint:** `PATCH /admin/orders/:id/status`

**Request Body:**
```json
{
  "status": "Delivered"
}
```

**Success Response (200):**
```json
{
  "message": "Order status updated",
  "order": {...}
}
```

---

### Delete Order

**Endpoint:** `DELETE /admin/orders/:id`

**Success Response (200):**
```json
{
  "message": "Order deleted successfully"
}
```

---

## Admin Inventory Endpoints

### Toggle Item Availability

**Endpoint:** `PATCH /admin/inventory/items/:id/availability`

**Success Response (200):**
```json
{
  "message": "Availability updated",
  "item": {
    "id": 1,
    "availability": false
  }
}
```

---

## Admin Billing Endpoints

### Get All Bills

**Endpoint:** `GET /admin/billing`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "items": [...],
    "totalAmount": 500,
    "paymentMode": "Cash",
    "createdAt": "2026-02-11T16:00:00.000Z"
  }
]
```

---

### Create Bill

**Endpoint:** `POST /admin/billing`

**Request Body:**
```json
{
  "items": [
    {
      "itemId": 1,
      "itemName": "Gulab Jamun",
      "quantity": 2,
      "price": 100,
      "subtotal": 200
    }
  ],
  "totalAmount": 200,
  "paymentMode": "Cash"
}
```

---

## Admin Attendance Endpoints

### Get All Employees

**Endpoint:** `GET /admin/attendance/employees`

---

### Mark Attendance

**Endpoint:** `POST /admin/attendance`

**Request Body:**
```json
{
  "employeeId": 1,
  "date": "2026-02-11",
  "isPresent": true
}
```

---

## Admin Messages Endpoints

### Get All Messages

**Endpoint:** `GET /admin/messages`

---

### Delete Message

**Endpoint:** `DELETE /admin/messages/:id`

---

## Admin Coupons Endpoints

### Get All Coupons

**Endpoint:** `GET /admin/coupons`

---

### Create Coupon

**Endpoint:** `POST /admin/coupons`

**Request Body:**
```json
{
  "code": "SAVE10",
  "discountType": "percentage",
  "discountValue": 10,
  "minOrderValue": 200,
  "expiryDate": "2026-12-31",
  "usageLimit": 100
}
```

---

### Delete Coupon

**Endpoint:** `DELETE /admin/coupons/:id`

---

## File Upload Endpoints

### Upload Image

**Endpoint:** `POST /api/uploads`

**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: [Image File]
```

**Success Response (200):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "image-1234567890.jpg",
    "path": "/uploads/image-1234567890.jpg"
  }
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Different endpoints have different rate limits:

- **Authentication endpoints**: 5 requests per 15 minutes
- **API endpoints**: 100 requests per minute

When rate limit is exceeded:

```json
{
  "message": "Too many requests",
  "retryAfter": 300
}
```

The `retryAfter` field indicates seconds to wait before retrying.

---

For more information, contact the development team.
