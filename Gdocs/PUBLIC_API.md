# Sweet Tooth API - Public Documentation

Welcome to the Sweet Tooth API documentation for developers integrating with our platform.

## Base URL

```
Production: https://api.yourdomain.com
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Obtain a token by logging in through the `/auth/login` endpoint.

---

## 📋 Available Endpoints

### 🔐 Authentication

#### Register New Account

Create a new customer account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

#### User Login

Authenticate and receive an access token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### 🛍️ Products

#### Get All Products

Retrieve the complete product catalog.

**Endpoint:** `GET /items`

**Authentication:** Not required

**Response:**
```json
[
  {
    "id": 1,
    "category": "Regular",
    "item_name": "Gulab Jamun",
    "price": 200,
    "image_url": "/uploads/image-123.jpg",
    "isavailable": true,
    "iskilo": true
  }
]
```

---

#### Get Product Details

Get information about a specific product.

**Endpoint:** `GET /items/:id`

**Authentication:** Not required

**Response:**
```json
{
  "id": 1,
  "category": "Regular",
  "item_name": "Gulab Jamun",
  "price": 200,
  "image_url": "/uploads/image-123.jpg",
  "isavailable": true,
  "iskilo": true
}
```

---

### 🛒 Orders

#### Validate Cart

Validate cart items and get current prices.

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
    }
  ]
}
```

**Response:**
```json
{
  "items": [...],
  "total": 200
}
```

---

#### Create Order

Place a new order.

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

**Response:**
```json
{
  "message": "Order created successfully",
  "orderId": 123,
  "total": 200
}
```

---

#### Get My Orders

Retrieve your order history.

**Endpoint:** `GET /order/my-orders`

**Authentication:** Required

**Response:**
```json
[
  {
    "id": 123,
    "total": 200,
    "status": "Pending",
    "items": [...],
    "createdAt": "2026-02-11T16:00:00.000Z"
  }
]
```

---

#### Cancel Order

Cancel a pending order.

**Endpoint:** `DELETE /order/cancel/:id`

**Authentication:** Required

**Response:**
```json
{
  "message": "Order cancelled successfully"
}
```

---

### 👤 User Profile

#### Get Profile

Retrieve your profile information.

**Endpoint:** `GET /user/profile`

**Authentication:** Required

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "addresses": [...]
}
```

---

#### Add/Update Address

Manage delivery addresses.

**Endpoint:** `POST /user/address`

**Authentication:** Required

**Request Body:**
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

---

#### Delete Address

Remove a saved address.

**Endpoint:** `DELETE /user/address/:id`

**Authentication:** Required

---

### 📧 Contact

#### Send Message

Submit a contact inquiry.

**Endpoint:** `POST /contact`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Product Inquiry",
  "message": "I would like to know..."
}
```

---

### 🎟️ Coupons

#### Validate Coupon

Check if a coupon code is valid.

**Endpoint:** `POST /coupons/validate`

**Authentication:** Not required

**Request Body:**
```json
{
  "code": "SAVE10",
  "orderValue": 500
}
```

**Response:**
```json
{
  "valid": true,
  "discount": 50
}
```

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Login required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## 🔒 Rate Limiting

To prevent abuse, the API implements rate limiting:

- **Authentication endpoints**: 5 requests per 15 minutes
- **General API endpoints**: 100 requests per minute

When rate limit is exceeded, you'll receive a `429` status code with a `retryAfter` field indicating when to retry.

---

## 🛡️ Security

### HTTPS Only
All API requests must be made over HTTPS in production.

### Token Expiration
JWT tokens expire after 24 hours. You'll need to login again to get a new token.

### Input Validation
All inputs are validated server-side. Ensure you send properly formatted data.

---

## 💡 Best Practices

1. **Store tokens securely** - Never expose tokens in URLs or logs
2. **Handle errors gracefully** - Check response codes and error messages
3. **Respect rate limits** - Implement exponential backoff
4. **Validate on client** - Validate inputs before sending to reduce errors
5. **Use HTTPS** - Never send credentials over HTTP

---

## 🆘 Support

For API support or to report issues:
- Email: support@sweettooth.com
- Documentation: https://docs.sweettooth.com

---

**Note:** This documentation covers public customer-facing endpoints only. Admin and internal endpoints are not documented publicly for security reasons.
