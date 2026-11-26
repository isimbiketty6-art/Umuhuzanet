# Umuhuza Connect — Online Agricultural Marketplace (Rwanda)

**"Connecting Agricultural Sellers and Customers Online."**  
*Kinyarwanda tagline:* **Aho abacuruzi n’abakiriya bahurira online.**

A full-stack, high-performance agricultural marketplace engineered with **React.js**, **PHP 8.2+**, and **MySQL 8.0**.

---

## 1. System Architecture

```text
+-------------------------------------------------------+
|                 Frontend (React.js)                   |
|  - Multi-Role Portals: Buyer, Seller, Trader, Admin   |
|  - Agricultural Job Seek Portal (Find & post jobs)    |
|  - Bilingual Interface (English & Kinyarwanda)        |
|  - Shopping Cart & MTN MoMo / Airtel Money Checkout   |
+---------------------------+---------------------------+
                            | HTTP / JSON REST APIs
                            v
+-------------------------------------------------------+
|                  REST API (PHP 8.2+)                  |
|  - Stateless JSON Dispatcher (api/index.php)          |
|  - High-Throughput PDO Connection Pool (config/db.php)|
|  - Role-based Access & Validation Policies            |
+---------------------------+---------------------------+
                            | SQL / TCP
                            v
+-------------------------------------------------------+
|                  Database (MySQL 8.0)                 |
|  - InnoDB Engine with Referential Foreign Keys        |
|  - Users, Sellers, Products, Orders, Order_Items      |
|  - Messages, Reviews, Categories, Agri_Jobs           |
+-------------------------------------------------------+
```

---

## 2. Project Directory Structure

```text
umuhuza-connect/
├── frontend/                     # React.js SPA (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx        # Bilingual navigation & portal switcher
│   │   │   ├── Hero.tsx          # 4 Value Pillars, search & categories
│   │   │   ├── ProductCatalog.tsx# Produce cards, quantity steppers, filters
│   │   │   ├── CartDrawer.tsx    # Shopping cart & MoMo checkout
│   │   │   ├── BuyerPortal.tsx   # Order tracking & favorites
│   │   │   ├── SellerPortal.tsx  # Product management & order fulfillment
│   │   │   ├── TraderPortal.tsx  # Wholesale & cooperative sourcing
│   │   │   ├── AgriJobsPortal.tsx# Farm jobs & application workflow
│   │   │   ├── AdminPortal.tsx   # Platform KPIs & verification queue
│   │   │   ├── AgriAiAssistant.tsx # Bilingual AI farm intelligence
│   │   │   └── SystemArchitectureView.tsx # Stack & API inspector
│   │   ├── data/
│   │   │   ├── agriData.ts       # Rwandan produce, districts & jobs
│   │   │   └── translations.ts   # English & Kinyarwanda strings
│   │   ├── types/
│   │   │   └── agri.ts           # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # PHP REST API & MySQL
│   ├── api/
│   │   └── index.php             # JSON Router for /products, /orders, etc.
│   ├── config/
│   │   └── database.php          # High-performance PDO connector
│   ├── database/
│   │   ├── schema.sql            # Complete MySQL 8.0 schema & seed data
│   │   └── migrations/           # Laravel schema migration files
│   └── NOTES.md                  # Backend integration checklist
└── README.md
```

---

## 3. Quick Start

### Frontend (React.js)
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000` with interactive client-side and simulated API responses.

### Backend (PHP & MySQL)
1. Import database schema:
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```
2. Configure credentials in `backend/config/database.php` or `.env`:
   ```bash
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=umuhuza_connect
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
3. Start PHP built-in server or deploy to Apache/Nginx:
   ```bash
   cd backend
   php -S 127.0.0.1:8000 -t api
   ```

---

## 4. Key Endpoints

- `GET  /api/products` — Filter products by category, district, and search keywords
- `POST /api/products` — Publish new agricultural produce
- `POST /api/orders` — Place order with MTN MoMo, Airtel Money, or Cash on delivery
- `GET  /api/dashboard` — Platform overview KPI metrics
- `GET  /api/jobs` — Agricultural vacancies and farm opportunities across Rwanda
