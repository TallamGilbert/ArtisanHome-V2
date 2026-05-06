# ArtisanHome

> Premium Furniture E-Commerce Platform

**Frontend:** React 18 + Vite 5 + Tailwind CSS  
**Backend:** Laravel 11 + Sanctum + MySQL 8

---

## Overview

ArtisanHome is a full-stack platform for handcrafted furniture, inspired by luxury brands. It features a customer-facing storefront, a complete admin dashboard, and a REST API backend.

The frontend works fully standalone with mock data — no backend required for UI exploration.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite 5, Tailwind CSS 3, React Router 6 |
| Backend   | Laravel 11, Sanctum, MySQL 8                   |
| HTTP      | Axios                                           |
| Fonts     | Cormorant Garamond, Jost, Playfair Display      |

---

## Features

### Customer Storefront
- Homepage with hero slider, category grid, featured products, and best sellers
- Shop with product grid, filters, and sorting
- Product detail with image gallery, color selection, and reviews
- Slide-out cart drawer and full cart page
- Multi-step checkout with dummy payment
- Wishlist — save and manage favorites
- Room inspiration gallery
- Full-text product search

### Admin Dashboard
- Stats overview and sales chart
- Product CRUD with image uploads
- Category management
- Order viewing and status updates
- Customer browsing

### Backend API
- Token-based auth via Laravel Sanctum
- REST endpoints for all resources
- Admin middleware for protected routes
- Pagination and file upload support

---

## Project Structure
artisanhome/
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── App.jsx
└── backend/
├── app/
├── database/
├── routes/
└── bootstrap/app.php

---

## Getting Started

### Prerequisites

- Node.js 18+ & npm
- PHP 8.2+
- Composer 2+
- MySQL 8.0+

### Backend Setup

```bash
cd artisanhome/backend
composer install
cp .env.example .env
php artisan key:generate
mysql -u root -p -e "CREATE DATABASE artisanhome CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
# API runs at http://localhost:8000
```

### Frontend Setup

```bash
cd artisanhome/frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000/api
npm run dev
# App runs at http://localhost:3000
```

---

## Environment Variables

### Frontend
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend
```env
APP_NAME=ArtisanHome
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=artisanhome
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
```

---

## Demo Credentials

| Role     | Email                 | Password |
|----------|-----------------------|----------|
| Admin    | admin@artisanhome.com | password |
| Customer | sarah@example.com     | password |

> In demo mode, `admin@artisanhome.com` grants admin access. Any other email logs in as a customer.

---

## API Reference

### Authentication

| Method | Endpoint       | Description          | Auth |
|--------|----------------|----------------------|------|
| POST   | /api/register  | Register new user    | ✗    |
| POST   | /api/login     | Login, returns token | ✗    |
| POST   | /api/logout    | Revoke token         | ✓    |
| GET    | /api/user      | Authenticated user   | ✓    |

### Products

| Method | Endpoint                      | Description          | Auth |
|--------|-------------------------------|----------------------|------|
| GET    | /api/products                 | List all (paginated) | ✗    |
| GET    | /api/products/{id}            | Single product       | ✗    |
| GET    | /api/products/featured        | Featured products    | ✗    |
| GET    | /api/products/best-sellers    | Best sellers         | ✗    |
| GET    | /api/products/search?q=chair  | Search products      | ✗    |

**Query params:** `category`, `min_price`, `max_price`, `material`, `sort`, `per_page`

### Categories

| Method | Endpoint                         | Description          | Auth |
|--------|----------------------------------|----------------------|------|
| GET    | /api/categories                  | List all             | ✗    |
| GET    | /api/categories/{id}             | Single category      | ✗    |
| GET    | /api/categories/{slug}/products  | Products in category | ✗    |

### Orders

| Method | Endpoint          | Description     | Auth |
|--------|-------------------|-----------------|------|
| GET    | /api/orders       | My orders       | ✓    |
| POST   | /api/orders       | Place new order | ✓    |
| GET    | /api/orders/{id}  | Order detail    | ✓    |

### Reviews

| Method | Endpoint                    | Description     | Auth |
|--------|-----------------------------|-----------------|------|
| GET    | /api/products/{id}/reviews  | Product reviews | ✗    |
| POST   | /api/products/{id}/reviews  | Post review     | ✓    |

### Wishlist

| Method | Endpoint            | Description          | Auth |
|--------|---------------------|----------------------|------|
| GET    | /api/wishlist       | Get wishlist         | ✓    |
| POST   | /api/wishlist       | Add to wishlist      | ✓    |
| DELETE | /api/wishlist/{id}  | Remove from wishlist | ✓    |

### Admin

| Method | Endpoint                       | Description         |
|--------|--------------------------------|---------------------|
| GET    | /api/admin/dashboard           | Stats overview      |
| GET    | /api/admin/products            | All products        |
| POST   | /api/admin/products            | Create product      |
| PUT    | /api/admin/products/{id}       | Update product      |
| DELETE | /api/admin/products/{id}       | Delete product      |
| GET    | /api/admin/orders              | All orders          |
| PUT    | /api/admin/orders/{id}/status  | Update order status |
| GET    | /api/admin/users               | All customers       |
| POST   | /api/admin/categories          | Create category     |
| PUT    | /api/admin/categories/{id}     | Update category     |
| DELETE | /api/admin/categories/{id}     | Delete category     |

---

## Design System

### Colors

| Name       | Hex       | Usage                      |
|------------|-----------|----------------------------|
| Brown      | `#6B3E26` | Primary accent, CTAs       |
| Brown Dark | `#4A2C1A` | Hover states               |
| Beige      | `#F5EFE6` | Section backgrounds        |
| Cream      | `#FAF7F2` | Card backgrounds           |
| Warm       | `#E8DDD0` | Borders, dividers          |
| Charcoal   | `#2C2C2C` | Primary text               |
| Gray Soft  | `#6B6B6B` | Secondary text             |

### Typography

| Font               | Usage             | Weights       |
|--------------------|-------------------|---------------|
| Cormorant Garamond | Headings, display | 300, 400, 600 |
| Jost               | Body, UI          | 300, 400, 500 |
| Playfair Display   | Accent quotes     | 400, 700      |

---

## Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

<sub>Built with intention · ArtisanHome by Gilbert Tallam</sub>
