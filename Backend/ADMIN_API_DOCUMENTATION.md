# Sweet Tooth Admin Panel - API Documentation

## Overview
Complete admin panel backend implementation with the following modules:
- Orders Management
- Messages/Contact Management
- Billing System
- Inventory Management
- Attendance System

---

## Database Models Added

### Bill Model
```prisma
model Bill {
  id          Int      @id @default(autoincrement())
  items       Json     // Array of {itemId, itemName, quantity, price, subtotal}
  totalAmount Int
  paymentMode String   @default("Cash") // Cash, UPI, Card
  createdAt   DateTime @default(now())
}
```

### Employee Model
```prisma
model Employee {
  id          Int          @id @default(autoincrement())
  name        String
  phone       String?
  role        String       @default("Staff")
  isActive    Boolean      @default(true)
  createdAt   DateTime     @default(now())
  attendances Attendance[]
}
```

### Attendance Model
```prisma
model Attendance {
  id         Int      @id @default(autoincrement())
  employeeId Int
  employee   Employee @relation(fields: [employeeId], references: [id])
  date       DateTime @default(now())
  isPresent  Boolean  @default(true)
}
```

---

## API Endpoints

### 1. Orders Management (`/admin/orders`)

#### GET `/admin/orders`
Fetch all orders with user details and filtering

**Query Parameters:**
- `status` (optional): Filter by order status (Pending, Delivered, Cancelled)
- `startDate` (optional): Filter orders from this date
- `endDate` (optional): Filter orders until this date

**Response:**
```json
[
  {
    "id": 1,
    "userId": 5,
    "total": 1250,
    "status": "Pending",
    "items": [...],
    "createdAt": "2026-02-02T10:00:00Z",
    "user": {
      "id": 5,
      "username": "john_doe",
      "email": "john@example.com",
      "phone": "+91 9876543210"
    }
  }
]
```

#### PATCH `/admin/orders/:id/status`
Update order status

**Body:**
```json
{
  "status": "Delivered"
}
```

---

### 2. Messages Management (`/admin/messages`)

#### GET `/admin/messages`
Fetch all contact form messages

**Response:**
```json
[
  {
    "id": 1,
    "name": "Customer Name",
    "email": "customer@example.com",
    "subject": "Bulk Order Inquiry",
    "message": "I would like to order...",
    "createdAt": "2026-02-02T09:00:00Z"
  }
]
```

#### DELETE `/admin/messages/:id`
Delete a message

---

### 3. Billing System (`/admin/billing`)

#### POST `/admin/billing/create`
Create a new bill (automatically fetches current prices from database)

**Body:**
```json
{
  "items": [
    {
      "itemId": 1,
      "quantity": 2
    },
    {
      "itemId": 5,
      "quantity": 1
    }
  ],
  "paymentMode": "Cash" // or "UPI", "Card"
}
```

**Response:**
```json
{
  "message": "Bill created successfully",
  "bill": {
    "id": 1,
    "items": [
      {
        "itemId": 1,
        "itemName": "Gulab Jamun",
        "quantity": 2,
        "price": 200,
        "subtotal": 400
      }
    ],
    "totalAmount": 400,
    "paymentMode": "Cash",
    "createdAt": "2026-02-02T10:00:00Z"
  }
}
```

#### GET `/admin/billing/history`
Fetch billing history with filters

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `paymentMode` (optional): Filter by payment mode (Cash, UPI, Card)

#### GET `/admin/billing/:id`
Get single bill details

---

### 4. Inventory Management (`/admin/inventory`)

#### GET `/admin/inventory/items`
Fetch all items

**Response:**
```json
[
  {
    "id": 1,
    "category": "Sweets",
    "item_name": "Gulab Jamun",
    "price": 200,
    "image_url": "/uploads/gulab.jpg",
    "availability": true
  }
]
```

#### PATCH `/admin/inventory/items/:id/availability`
Toggle item availability (stock in/out of stock)

**Response:**
```json
{
  "message": "Item availability updated",
  "item": {
    "id": 1,
    "availability": false
  }
}
```

#### PATCH `/admin/inventory/items/:id`
Update item details

**Body:**
```json
{
  "item_name": "Premium Gulab Jamun",
  "price": 250,
  "category": "Premium Sweets"
}
```

---

### 5. Attendance Management (`/admin/attendance`)

#### GET `/admin/attendance/employees`
Fetch all employees with recent attendance

**Response:**
```json
[
  {
    "id": 1,
    "name": "Rajesh Kumar",
    "phone": "+91 9876543210",
    "role": "Staff",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "attendances": [
      {
        "id": 1,
        "date": "2026-02-02T00:00:00Z",
        "isPresent": true
      }
    ]
  }
]
```

#### POST `/admin/attendance/employees`
Add new employee

**Body:**
```json
{
  "name": "Rajesh Kumar",
  "phone": "+91 9876543210",
  "role": "Manager"
}
```

#### DELETE `/admin/attendance/employees/:id`
Remove/deactivate employee (soft delete)

#### POST `/admin/attendance`
Record attendance

**Body:**
```json
{
  "employeeId": 1,
  "isPresent": true,
  "date": "2026-02-02" // optional, defaults to today
}
```

#### GET `/admin/attendance`
Get attendance records with filters

**Query Parameters:**
- `employeeId` (optional): Filter by employee
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**
```json
[
  {
    "id": 1,
    "employeeId": 1,
    "date": "2026-02-02T00:00:00Z",
    "isPresent": true,
    "employee": {
      "id": 1,
      "name": "Rajesh Kumar",
      "role": "Staff"
    }
  }
]
```

---

## Frontend Implementation Notes

### For Label Printing (CSS)
To enable print-friendly label CSS:

1. Create a separate CSS file for print styles:
```css
@media print {
  /* Hide everything except the label */
  body * {
    visibility: hidden;
  }
  
  .label-container, .label-container * {
    visibility: visible;
  }
  
  .label-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  
  /* Remove margins for printing */
  @page {
    margin: 0;
  }
  
  /* Label specific styles */
  .label {
    page-break-after: always;
    border: 2px solid #000;
    padding: 10mm;
  }
}
```

2. Use `window.print()` in your React component:
```javascript
const handlePrintLabel = () => {
  window.print();
};
```

---

## Next Steps for Frontend

1. **Orders Page**: 
   - Fetch from `/admin/orders`
   - Add filters for status and date range
   - Display user details with each order

2. **Messages Section**:
   - Fetch from `/admin/messages`
   - Display in a table/card layout
   - Add delete functionality

3. **Billing Section**:
   - Create form to select items and quantities
   - Items auto-populate from `/admin/inventory/items`
   - Submit to `/admin/billing/create`
   - View history from `/admin/billing/history`
   - Add date and payment mode filters

4. **Inventory Page**:
   - Display all items from `/admin/inventory/items`
   - Add toggle switch for availability
   - Calls `/admin/inventory/items/:id/availability` on toggle

5. **Attendance Page**:
   - List employees from `/admin/attendance/employees`
   - Add form to add new employee
   - Daily attendance marking interface
   - View attendance records with filters

---

## Security Recommendations

1. Add authentication middleware to all admin routes
2. Implement role-based access control (RBAC)
3. Add rate limiting to prevent abuse
4. Validate all inputs on the backend
5. Use HTTPS in production

---

## Testing the APIs

You can test these endpoints using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example curl:
```bash
# Get all orders
curl http://localhost:5016/admin/orders

# Create a bill
curl -X POST http://localhost:5016/admin/billing/create \
  -H "Content-Type: application/json" \
  -d '{"items":[{"itemId":1,"quantity":2}],"paymentMode":"Cash"}'

# Toggle item availability
curl -X PATCH http://localhost:5016/admin/inventory/items/1/availability
```
