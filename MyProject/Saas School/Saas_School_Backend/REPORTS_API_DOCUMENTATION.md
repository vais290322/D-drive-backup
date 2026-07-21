# Reports API Documentation

## Overview
This comprehensive reports API provides detailed analytics for sales, purchases, and inventory management. All endpoints require a `schoolId` parameter.

## Base URL
```
/api/reports
```

---

## 📊 Today's Reports

### 1. Get Today's Sales Report
**Endpoint:** `GET /api/reports/:schoolId/today/sales`

**Description:** Get detailed sales report for today

**Response:**
```json
{
  "success": true,
  "message": "Today's sales report fetched successfully",
  "data": {
    "summary": {
      "totalTransactions": 15,
      "totalGrossAmount": 50000,
      "totalDiscount": 2000,
      "totalNetAmount": 48000,
      "totalAmount": 48000,
      "totalItemsSold": 120
    },
    "transactions": [...],
    "reportDate": "2026-01-03"
  }
}
```

### 2. Get Today's Purchase Report
**Endpoint:** `GET /api/reports/:schoolId/today/purchases`

**Description:** Get detailed purchase report for today

**Response:** Similar structure to sales report

### 3. Get Today's Overall Report
**Endpoint:** `GET /api/reports/:schoolId/today/overall`

**Description:** Get combined sales and purchase report for today with profit/loss calculation

**Response:**
```json
{
  "success": true,
  "message": "Today's overall report fetched successfully",
  "data": {
    "sales": {
      "totalTransactions": 15,
      "totalAmount": 48000,
      "totalDiscount": 2000,
      "totalItems": 120
    },
    "purchases": {
      "totalTransactions": 8,
      "totalAmount": 30000,
      "totalDiscount": 1000,
      "totalItems": 80
    },
    "profitLoss": 18000,
    "netRevenue": 48000,
    "netExpenditure": 30000,
    "reportDate": "2026-01-03"
  }
}
```

---

## 📈 All Time Reports

### 4. Get All Time Sales Report
**Endpoint:** `GET /api/reports/:schoolId/alltime/sales`

**Description:** Get comprehensive sales report for all time

**Response:**
```json
{
  "success": true,
  "message": "All time sales report fetched successfully",
  "data": {
    "summary": {
      "totalTransactions": 500,
      "totalGrossAmount": 2000000,
      "totalDiscount": 50000,
      "totalNetAmount": 1950000,
      "totalAmount": 1950000,
      "totalItemsSold": 5000,
      "averageTransactionValue": 3900
    },
    "firstTransaction": "2025-01-01T00:00:00.000Z",
    "lastTransaction": "2026-01-03T16:30:00.000Z",
    "recentTransactions": [...]
  }
}
```

### 5. Get All Time Purchase Report
**Endpoint:** `GET /api/reports/:schoolId/alltime/purchases`

**Description:** Get comprehensive purchase report for all time

**Response:** Similar structure to all time sales report

### 6. Get All Time Overall Report
**Endpoint:** `GET /api/reports/:schoolId/alltime/overall`

**Description:** Get combined all-time sales and purchase report with profit margin

**Response:**
```json
{
  "success": true,
  "message": "All time overall report fetched successfully",
  "data": {
    "sales": {
      "totalTransactions": 500,
      "totalAmount": 1950000,
      "totalDiscount": 50000,
      "totalItems": 5000,
      "averageValue": 3900
    },
    "purchases": {
      "totalTransactions": 300,
      "totalAmount": 1200000,
      "totalDiscount": 30000,
      "totalItems": 3500,
      "averageValue": 4000
    },
    "profitLoss": 750000,
    "profitMargin": "38.46%",
    "netRevenue": 1950000,
    "netExpenditure": 1200000
  }
}
```

---

## 📦 Inventory Reports

### 7. Get Inventory Report
**Endpoint:** `GET /api/reports/:schoolId/inventory`

**Description:** Get current inventory status with stock levels

**Response:**
```json
{
  "success": true,
  "message": "Inventory report fetched successfully",
  "data": {
    "summary": {
      "totalItems": 150,
      "totalStock": 5000,
      "totalValue": 500000,
      "totalPurchaseStock": 8000,
      "totalSellStock": 3000,
      "lowStockItems": 12,
      "outOfStockItems": 3
    },
    "lowStockItems": [...],
    "outOfStockItems": [...],
    "allItems": [...]
  }
}
```

---

## 🏷️ Category-wise Reports

### 8. Get Category-wise Sales Report
**Endpoint:** `GET /api/reports/:schoolId/category/sales?startDate=2026-01-01&endDate=2026-01-03`

**Query Parameters:**
- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format

**Description:** Get sales breakdown by category

**Response:**
```json
{
  "success": true,
  "message": "Category-wise sales report fetched successfully",
  "data": {
    "totalCategories": 10,
    "categories": [
      {
        "category": "Books",
        "categoryId": "507f1f77bcf86cd799439011",
        "totalQuantity": 500,
        "totalAmount": 50000,
        "transactions": 120
      },
      ...
    ]
  }
}
```

### 9. Get Category-wise Purchase Report
**Endpoint:** `GET /api/reports/:schoolId/category/purchases?startDate=2026-01-01&endDate=2026-01-03`

**Query Parameters:** Same as category-wise sales

**Description:** Get purchase breakdown by category

**Response:** Similar structure to category-wise sales report

---

## 📅 Date Range Reports

### 10. Get Sales Report by Date Range
**Endpoint:** `GET /api/reports/:schoolId/daterange/sales?startDate=2026-01-01&endDate=2026-01-03`

**Query Parameters:**
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format

**Description:** Get detailed sales report for a specific date range

**Response:**
```json
{
  "success": true,
  "message": "Sales report by date range fetched successfully",
  "data": {
    "summary": {
      "totalTransactions": 50,
      "totalGrossAmount": 200000,
      "totalDiscount": 5000,
      "totalNetAmount": 195000,
      "totalAmount": 195000,
      "totalItemsSold": 500
    },
    "transactions": [...],
    "dateRange": {
      "startDate": "2026-01-01",
      "endDate": "2026-01-03"
    }
  }
}
```

### 11. Get Purchase Report by Date Range
**Endpoint:** `GET /api/reports/:schoolId/daterange/purchases?startDate=2026-01-01&endDate=2026-01-03`

**Query Parameters:** Same as sales date range

**Description:** Get detailed purchase report for a specific date range

**Response:** Similar structure to sales date range report

---

## 🏆 Top Items Reports

### 12. Get Top Selling Items
**Endpoint:** `GET /api/reports/:schoolId/top/selling?limit=10&startDate=2026-01-01&endDate=2026-01-03`

**Query Parameters:**
- `limit` (optional, default: 10): Number of top items to return
- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format

**Description:** Get top selling items by quantity

**Response:**
```json
{
  "success": true,
  "message": "Top selling items fetched successfully",
  "data": {
    "topItems": [
      {
        "name": "Notebook A4",
        "code": "NB-A4-001",
        "category": "Stationery",
        "subCategory": "Notebooks",
        "totalQuantity": 500,
        "totalRevenue": 25000,
        "transactions": 120
      },
      ...
    ],
    "totalUniqueItems": 150
  }
}
```

### 13. Get Top Purchased Items
**Endpoint:** `GET /api/reports/:schoolId/top/purchased?limit=10&startDate=2026-01-01&endDate=2026-01-03`

**Query Parameters:** Same as top selling items

**Description:** Get top purchased items by quantity

**Response:** Similar structure to top selling items report

---

## 📊 Dashboard Report

### 14. Get Complete Dashboard Report
**Endpoint:** `GET /api/reports/:schoolId/dashboard`

**Description:** Get comprehensive dashboard with all key metrics (today's and all-time data)

**Response:**
```json
{
  "success": true,
  "message": "Dashboard report fetched successfully",
  "data": {
    "today": {
      "sales": {
        "transactions": 15,
        "amount": 48000,
        "items": 120
      },
      "purchases": {
        "transactions": 8,
        "amount": 30000,
        "items": 80
      }
    },
    "allTime": {
      "sales": {
        "transactions": 500,
        "amount": 1950000,
        "items": 5000
      },
      "purchases": {
        "transactions": 300,
        "amount": 1200000,
        "items": 3500
      }
    },
    "inventory": {
      "totalItems": 150,
      "totalStock": 5000,
      "totalValue": 500000,
      "lowStockItems": 12,
      "outOfStockItems": 3
    },
    "categories": {
      "totalCategories": 10,
      "totalSubCategories": 25
    },
    "profitLoss": {
      "today": 18000,
      "allTime": 750000
    },
    "reportGeneratedAt": "2026-01-03T16:36:16.000Z"
  }
}
```

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required parameters)
- `500` - Internal Server Error

---

## Usage Examples

### JavaScript/Fetch
```javascript
// Get today's sales report
const response = await fetch('/api/reports/SCHOOL123/today/sales');
const data = await response.json();
console.log(data);

// Get sales by date range
const response = await fetch('/api/reports/SCHOOL123/daterange/sales?startDate=2026-01-01&endDate=2026-01-03');
const data = await response.json();
console.log(data);

// Get dashboard report
const response = await fetch('/api/reports/SCHOOL123/dashboard');
const data = await response.json();
console.log(data);
```

### Axios
```javascript
// Get top selling items
const { data } = await axios.get('/api/reports/SCHOOL123/top/selling', {
  params: {
    limit: 20,
    startDate: '2026-01-01',
    endDate: '2026-01-03'
  }
});
console.log(data);
```

---

## Notes

1. All date parameters should be in `YYYY-MM-DD` format
2. The `schoolId` parameter is required for all endpoints
3. Date ranges are inclusive (both start and end dates are included)
4. Today's reports use the server's local time zone
5. All monetary values are in the base currency (no formatting applied)
6. Timestamps are returned in ISO 8601 format

---

## Summary of Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/:schoolId/today/sales` | GET | Today's sales report |
| `/:schoolId/today/purchases` | GET | Today's purchase report |
| `/:schoolId/today/overall` | GET | Today's overall report |
| `/:schoolId/alltime/sales` | GET | All time sales report |
| `/:schoolId/alltime/purchases` | GET | All time purchase report |
| `/:schoolId/alltime/overall` | GET | All time overall report |
| `/:schoolId/inventory` | GET | Current inventory report |
| `/:schoolId/category/sales` | GET | Category-wise sales report |
| `/:schoolId/category/purchases` | GET | Category-wise purchase report |
| `/:schoolId/daterange/sales` | GET | Sales by date range |
| `/:schoolId/daterange/purchases` | GET | Purchases by date range |
| `/:schoolId/top/selling` | GET | Top selling items |
| `/:schoolId/top/purchased` | GET | Top purchased items |
| `/:schoolId/dashboard` | GET | Complete dashboard report |
