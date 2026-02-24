# Database Schema Documentation

This document describes the database schema for the Sweet Tooth e-commerce platform.

---

## Database: PostgreSQL

**Version**: 14+  
**ORM**: Prisma  
**Schema File**: `Backend/prisma/schema.prisma`

---

## 📊 Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐
│    User     │───────│   Address    │
└─────────────┘  1:N  └──────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│    Order    │
└─────────────┘

┌──────────────┐
│     Item     │  (Products)
└──────────────┘

┌──────────────┐
│   Contact    │  (Customer Messages)
└──────────────┘

┌──────────────┐
│     Bill     │  (In-store Sales)
└──────────────┘

┌──────────────┐       ┌──────────────┐
│   Employee   │───────│  Attendance  │
└──────────────┘  1:N  └──────────────┘

┌──────────────┐
│ AdminProfile │  (Business Settings)
└──────────────┘

┌──────────────┐
│    Coupon    │  (Discount Codes)
└──────────────┘
```

---

## 📋 Tables

### 1. User

Stores customer account information.

**Table Name**: `User`

| Column   | Type         | Constraints       | Description                    |
|----------|--------------|-------------------|--------------------------------|
| id       | INT          | PK, AUTO_INCREMENT| Unique user identifier         |
| username | VARCHAR(30)  | UNIQUE, NOT NULL  | User's display name            |
| email    | VARCHAR(50)  | UNIQUE, NOT NULL  | Login email                    |
| phone    | VARCHAR(15)  | NULLABLE          | Contact number                 |
| password | TEXT         | NOT NULL          | Hashed password (bcrypt)       |

**Relationships:**
- One-to-Many with `Address`
- One-to-Many with `Order`

**Indexes:**
- Primary: `id`
- Unique: `username`, `email`

**Security:**
- Passwords stored with bcrypt hashing
- Email normalized to lowercase
- Password never returned in API responses

---

### 2. Address

Stores user delivery addresses.

**Table Name**: `Address`

| Column  | Type         | Constraints       | Description                    |
|---------|--------------|-------------------|--------------------------------|
| id      | INT          | PK, AUTO_INCREMENT| Unique address identifier      |
| label   | VARCHAR(20)  | DEFAULT 'Home'    | Address label (Home/Office)    |
| userId  | INT          | FK, NOT NULL      | Reference to User.id           |
| street  | VARCHAR(100) | NOT NULL          | Street address                 |
| city    | VARCHAR(50)  | NOT NULL          | City name                      |
| state   | VARCHAR(50)  | NOT NULL          | State/Province                 |
| zipCode | VARCHAR(10)  | NOT NULL          | Postal code                    |
| country | VARCHAR(50)  | NOT NULL          | Country name                   |

**Relationships:**
- Many-to-One with `User`

**Constraints:**
- Foreign Key: `userId` references `User(id)`

---

### 3. Order

Stores customer orders from the website.

**Table Name**: `Order`

| Column     | Type         | Constraints           | Description                    |
|------------|--------------|---  -------------------|--------------------------------|
| id         | INT          | PK, AUTO_INCREMENT    | Unique order identifier        |
| userId     | INT          | FK, NOT NULL          | Reference to User.id           |
| total      | INT          | NOT NULL              | Total amount in rupees         |
| status     | VARCHAR(20)  | DEFAULT 'Pending'     | Pending/Delivered/Cancelled    |
| items      | JSON         | NOT NULL              | Array of order items           |
| trackingId | VARCHAR(50)  | UNIQUE, NULLABLE      | Shipping tracking number       |
| createdAt  | TIMESTAMP    | DEFAULT NOW()         | Order creation time            |

**Items JSON Structure:**
```json
[
  {
    "id": 1,
    "name": "Gulab Jamun",
    "weight": 0.5,
    "quantity": 2,
    "pricePerUnit": 100,
    "subtotal": 200
  }
]
```

**Relationships:**
- Many-to-One with `User`

**Indexes:**
- Primary: `id`
- Foreign Key: `userId`
- Unique: `trackingId`
- Recommended: `status`, `createdAt` (for filtering)

**Business Logic:**
- `total` is calculated at order creation using current item prices
- `trackingId` is auto-generated for shipping labels
- Orders can only be cancelled when status is "Pending"

---

### 4. Item

Stores product catalog.

**Table Name**: `Item`

| Column       | Type        | Constraints       | Description                    |
|--------------|-------------|-------------------|--------------------------------|
| id           | INT         | PK, AUTO_INCREMENT| Unique item identifier         |
| category     | VARCHAR(20) | NOT NULL          | Product category               |
| item_name    | VARCHAR(50) | NOT NULL          | Product name                   |
| price        | INT         | NOT NULL          | Price per kg in rupees         |
| image_url    | TEXT        | NULLABLE          | Path to product image          |
| isavailable  | BOOLEAN     | DEFAULT TRUE      | In stock status                |
| iskilo       | BOOLEAN     | DEFAULT TRUE      | Priced per kg                  |
| isbill       | BOOLEAN     | DEFAULT FALSE     | Billing only status (no home)  |

**Categories:**
- Regular
- MilkSweets
- DryFruitSweets
- CoolSweets
- Snacks
- (Custom categories allowed)

**Indexes:**
- Primary: `id`
- Recommended: `category`, `availability`

**Notes:**
- `price` is per kilogram (or per piece if `iskilo = false`)
- Frontend calculates prices for 250g, 500g, 750g, 1kg options
- If `isbill = true`, item only appears in admin billing, not on customer homepage

---

### 5. Contact

Stores customer inquiry messages.

**Table Name**: `Contact`

| Column    | Type         | Constraints       | Description                    |
|-----------|--------------|-------------------|--------------------------------|
| id        | INT          | PK, AUTO_INCREMENT| Unique message identifier      |
| name      | VARCHAR(50)  | NOT NULL          | Customer name                  |
| email     | VARCHAR(50)  | NOT NULL          | Contact email                  |
| subject   | VARCHAR(100) | NULLABLE          | Message subject                |
| message   | TEXT         | NOT NULL          | Message content                |
| createdAt | TIMESTAMP    | DEFAULT NOW()     | Submission time                |

**Indexes:**
- Primary: `id`
- Recommended: `createdAt` (for sorting)

---

### 6. Bill

Stores in-store/offline sales records.

**Table Name**: `Bill`

| Column      | Type        | Constraints       | Description                    |
|-------------|-------------|-------------------|--------------------------------|
| id          | INT         | PK, AUTO_INCREMENT| Unique bill identifier         |
| items       | JSON        | NOT NULL          | Array of purchased items       |
| totalAmount | INT         | NOT NULL          | Total amount in rupees         |
| paymentMode | VARCHAR(20) | DEFAULT 'Cash'    | Cash/UPI/Card                  |
| createdAt   | TIMESTAMP   | DEFAULT NOW()     | Bill creation time             |

**Items JSON Structure:**
```json
[
  {
    "itemId": 1,
    "itemName": "Gulab Jamun",
    "quantity": 2,
    "price": 100,
    "subtotal": 200
  }
]
```

**Payment Modes:**
- Cash
- UPI
- Card

**Indexes:**
- Primary: `id`
- Recommended: `createdAt`, `paymentMode`

---

### 7. Employee

Stores employee information for attendance tracking.

**Table Name**: `Employee`

| Column    | Type        | Constraints           | Description                    |
|-----------|-------------|-----------------------|--------------------------------|
| id        | INT         | PK, AUTO_INCREMENT    | Unique employee identifier     |
| name      | VARCHAR(50) | NOT NULL              | Employee name                  |
| phone     | VARCHAR(15) | NULLABLE              | Contact number                 |
| role      | VARCHAR(30) | DEFAULT 'Staff'       | Job role                       |
| isActive  | BOOLEAN     | DEFAULT TRUE          | Employment status              |
| createdAt | TIMESTAMP   | DEFAULT NOW()         | Record creation time           |

**Relationships:**
- One-to-Many with `Attendance`

**Indexes:**
- Primary: `id`
- Recommended: `isActive`

---

### 8. Attendance

Stores daily employee attendance records.

**Table Name**: `Attendance`

| Column     | Type      | Constraints           | Description                    |
|------------|-----------|-----------------------|--------------------------------|
| id         | INT       | PK, AUTO_INCREMENT    | Unique attendance record ID    |
| employeeId | INT       | FK, NOT NULL          | Reference to Employee.id       |
| date       | TIMESTAMP | DEFAULT NOW()         | Attendance date                |
| isPresent  | BOOLEAN   | DEFAULT TRUE          | Present/Absent                 |

**Relationships:**
- Many-to-One with `Employee`

**Constraints:**
- Foreign Key: `employeeId` references `Employee(id)`

**Indexes:**
- Primary: `id`
- Foreign Key: `employeeId`
- Recommended: `date`, composite(`employeeId`, `date`)

---

### 9. AdminProfile

Stores business profile and branding settings.

**Table Name**: `AdminProfile`

| Column             | Type        | Constraints       | Description                    |
|--------------------|-------------|-------------------|--------------------------------|
| id                 | INT         | PK, AUTO_INCREMENT| Profile ID (typically 1)       |
| business_name      | TEXT        | NOT NULL          | Business name                  |
| address            | TEXT        | NOT NULL          | Business address               |
| gstin              | TEXT        | NULLABLE          | GST identification number      |
| phone              | TEXT        | NULLABLE          | Business phone                 |
| whatsapp           | TEXT        | NULLABLE          | WhatsApp number                |
| business_email     | TEXT        | NULLABLE          | Business email                 |
| instagram_url      | TEXT        | NULLABLE          | Instagram profile              |
| facebook_url       | TEXT        | NULLABLE          | Facebook page                  |
| frontend_logo      | TEXT        | NULLABLE          | Customer site logo path        |
| backend_logo       | TEXT        | NULLABLE          | Admin panel logo path          |
| business_logo      | TEXT        | NULLABLE          | General business logo          |
| Collections_image  | TEXT        | NULLABLE          | Collections page image         |
| OurStory_image     | TEXT        | NULLABLE          | About page image               |
| created_at         | TIMESTAMP   | DEFAULT NOW()     | Profile creation               |
| updated_at         | TIMESTAMP   | AUTO_UPDATE       | Last update                    |

**Usage:**
- Single record (id=1) stores all business settings
- Updated via Admin Panel
- No relationships

**Indexes:**
- Primary: `id`

---

### 10. Coupon

Stores discount coupon codes.

**Table Name**: `Coupon`

| Column        | Type        | Constraints           | Description                    |
|---------------|-------------|-----------------------|--------------------------------|
| id            | INT         | PK, AUTO_INCREMENT    | Unique coupon identifier       |
| code          | VARCHAR(20) | UNIQUE, NOT NULL      | Coupon code (e.g., SAVE10)     |
| discountType  | VARCHAR(10) | NOT NULL              | 'percentage' or 'fixed'        |
| discountValue | FLOAT       | NOT NULL              | Discount amount/percentage     |
| minOrderValue | FLOAT       | DEFAULT 0             | Minimum order for usage        |
| expiryDate    | TIMESTAMP   | NOT NULL              | Expiration date                |
| usageLimit    | INT         | DEFAULT 1, NULLABLE   | Max uses (NULL = unlimited)    |
| usedCount     | INT         | DEFAULT 0             | Times used                     |
| active        | BOOLEAN     | DEFAULT TRUE          | Active status                  |
| createdAt     | TIMESTAMP   | DEFAULT NOW()         | Creation time                  |
| updated_at    | TIMESTAMP   | AUTO_UPDATE           | Last update                    |

**Discount Types:**
- `percentage`: X% off (e.g., 10 for 10% off)
- `fixed`: ₹X off (e.g., 50 for ₹50 off)

**Validation:**
- Check `active = true`
- Check `expiryDate > NOW()`
- Check `usedCount < usageLimit` (if usageLimit is set)
- Check `orderValue >= minOrderValue`

**Indexes:**
- Primary: `id`
- Unique: `code`
- Recommended: `active`, `expiryDate`

---

## 🔄 Database Migrations

### Running Migrations

```bash
# Development: Create and apply migration
npx prisma migrate dev --name migration_name

# Production: Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# View migration status
npx prisma migrate status
```

### Migration History

Migrations are stored in `Backend/prisma/migrations/`

---

## 🔍 Common Queries

### Get User with Orders and Addresses

```javascript
const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
        addresses: true,
        orders: {
            orderBy: { createdAt: 'desc' },
            take: 10
        }
    }
});
```

### Get Orders with User Details

```javascript
const orders = await prisma.order.findMany({
    where: { status: 'Pending' },
    include: {
        user: {
            select: {
                username: true,
                email: true,
                phone: true,
                addresses: true
            }
        }
    },
    orderBy: { createdAt: 'desc' }
});
```

### Get Items by Category

```javascript
const items = await prisma.item.findMany({
    where: {
        category: 'MilkSweets',
        isavailable: true,
        isbill: false
    },
    orderBy: { item_name: 'asc' }
});
```

### Calculate Total Revenue

```javascript
const revenue = await prisma.order.aggregate({
    where: {
        status: 'Delivered',
        createdAt: {
            gte: new Date('2026-01-01'),
            lte: new Date('2026-12-31')
        }
    },
    _sum: {
        total: true
    }
});
```

---

## 📈 Performance Optimizations

### Recommended Indexes

```sql
-- Orders
CREATE INDEX idx_orders_user_id ON "Order"("userId");
CREATE INDEX idx_orders_status ON "Order"("status");
CREATE INDEX idx_orders_created_at ON "Order"("createdAt");

-- Items
CREATE INDEX idx_items_category ON "Item"("category");
CREATE INDEX idx_items_availability ON "Item"("availability");

-- Coupons
CREATE INDEX idx_coupons_code ON "Coupon"("code");
CREATE INDEX idx_coupons_active ON "Coupon"("active");
CREATE INDEX idx_coupons_expiry ON "Coupon"("expiryDate");

-- Attendance
CREATE INDEX idx_attendance_employee ON "Attendance"("employeeId");
CREATE INDEX idx_attendance_date ON "Attendance"("date");
CREATE INDEX idx_attendance_composite ON "Attendance"("employeeId", "date");
```

---

## 🔒 Security Considerations

1. **Password Storage**: Hashed with bcrypt, never stored in plain text
2. **Sensitive Data**: Excluded from API responses
3. **SQL Injection**: Protected by Prisma ORM
4. **Data Validation**: All inputs validated before database operations
5. **Connection Pooling**: Limits database connections
6. **Backups**: Daily automated backups recommended

---

## 🛠️ Database Maintenance

### Regular Tasks

**Daily:**
- Monitor query performance
- Check disk space

**Weekly:**
- Review slow queries
- Analyze table statistics

**Monthly:**
- Update table statistics
- Reindex if needed
- Review and archive old data

### Useful Commands

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('SweetTooth'));

-- Table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Vacuum analyze (maintenance)
VACUUM ANALYZE;
```

---

## 📊 Data Lifecycle

### User Data
- **Retention**: Indefinite
- **Deletion**: User can request account deletion (GDPR compliance)
- **Anonymization**: Orders remain but user data anonymized

### Orders
- **Retention**: 7 years (tax compliance)
- **Archival**: Move old orders to archive table after 2 years

### Logs
- **Retention**: 90 days
- **Cleanup**: Automated via cron job

---

## 🔄 Future Enhancements

1. **Audit Logging**: Track all data modifications
2. **Soft Deletes**: Mark records as deleted instead of removing
3. **Versioning**: Track changes to important records
4. **Partitioning**: Partition large tables (Orders) by date
5. **Read Replicas**: For scaling read operations
6. **Caching**: Redis for frequently accessed data

---

For more information on database operations, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
