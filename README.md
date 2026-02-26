# Promo Code System

Backend API for validating and applying promo codes with:

- Percentage / capped cashback
- Per-user usage limit
- Global usage limit
- Min / max recharge validation
- JWT-based authentication
- Duplicate transaction protection

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

# Environment Setup

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/promodb
JWT_SECRET=your_super_secret_key
```

## Variable Explanation

| Variable   | Description                    |
| ---------- | ------------------------------ |
| PORT       | Server port                    |
| MONGO_URI  | MongoDB connection string      |
| JWT_SECRET | Secret used to sign JWT tokens |

If using MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/promodb
```

---

# Installation & Running

```bash
npm install
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

# Database Seeding

Insert the following document into the `promocodes` collection:

```json
{
  "code": "NEW50",
  "minRechargeAmount": 100,
  "maxRechargeAmount": 1000,
  "isGlobal": true,
  "cashbackType": "PERCENTAGE",
  "percentage": 10,
  "maxCashbackCap": 50,
  "perUserLimit": 2,
  "totalUsageLimit": 5,
  "currentTotalUsage": 0,
  "isActive": true,
  "validFrom": "2025-01-01T00:00:00.000Z",
  "validTill": "2026-12-31T23:59:59.000Z"
}
```

---

# Authentication

All endpoints require JWT authentication.

Add header:

```
Authorization: Bearer <your_token>
```

Token payload example:

```json
{
  "userId": "user_001"
}
```

---

# API Endpoints

---

## 1. Validate Promo

### Endpoint

```
POST /api/promo/validate
```

### Request Body

```json
{
  "code": "NEW50",
  "rechargeAmount": 500
}
```

### Success Response

```json
{
  "valid": true,
  "cashback": 50
}
```

---

## 2. Apply Promo

### Endpoint

```
POST /api/promo/apply
```

### Request Body

```json
{
  "code": "NEW50",
  "rechargeAmount": 500,
  "transactionId": "txn_001"
}
```

### Success Response

```json
{
  "success": true,
  "cashback": 50
}
```

On successful apply:

- `currentTotalUsage` increments
- A new record is created in `promousages` collection

---

# Business Rules

## Cashback Calculation

- 10% of recharge amount
- Capped at `maxCashbackCap`
- Valid only between `validFrom` and `validTill`

---

## Per-User Limit

- Maximum 2 uses per user
- Third attempt returns:

```json
{
  "success": false,
  "message": "User limit exceeded"
}
```

---

## Global Usage Limit

- Maximum 5 total successful uses
- After limit reached:

```json
{
  "success": false,
  "message": "Promo exhausted"
}
```

---

## Minimum Recharge Validation

```json
{
  "code": "NEW50",
  "rechargeAmount": 50
}
```

Fails because minimum recharge is 100.

---

## Duplicate Transaction Protection

Reusing the same `transactionId` will fail:

```json
{
  "success": false,
  "message": "Duplicate transaction"
}
```

Ensures idempotency.

---

# Test Checklist

| Test Case             | Expected Result               |
| --------------------- | ----------------------------- |
| Valid promo           | Cashback calculated correctly |
| Apply promo           | Usage recorded                |
| Per-user limit        | Block after 2 uses            |
| Global limit          | Block after 5 uses            |
| Invalid code          | Error                         |
| Low recharge          | Validation error              |
| Duplicate transaction | Rejected                      |

---

# Project Structure (Example)

```
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── config/
 └── server.ts
```

---

# Production Considerations

- Add DB indexes on:
  - `code`
  - `transactionId`
  - `userId`
- Use atomic updates for usage counters
- Add logging for fraud monitoring
- Consider event-driven cashback crediting
- Add rate limiting

---

# Future Improvements

- Admin dashboard
- Fixed-amount cashback support
- Promo segmentation
- A/B testing support
- Expiry cron cleanup

---
