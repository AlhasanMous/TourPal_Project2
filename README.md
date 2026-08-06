# TourPal Backend API

A RESTful backend API for the **TourPal** tourism platform, built with **Laravel 12**.

---

## 📌 Project Overview

TourPal is a tourism platform designed to help tourists explore Syria by providing features such as:

-   Tourist Authentication
-   Places & Cities Management
-   Tourist Guides
-   Accommodation Booking
-   Travel Workspaces
-   Collaborative Trip Planning
-   Timeline Management
-   Wishlist
-   Reviews
-   Notifications
-   Tourist Matching
-   Messaging System
-   Transportation Routes

---

# 🛠 Tech Stack

-   PHP 8.2+
-   Laravel 12
-   MySQL
-   Laravel Sanctum
-   Spatie Laravel Permission
-   Composer

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd TourPal_Project2
```

---

## 2. Install dependencies

```bash
composer install
```

---

## 3. Create environment file

Linux / macOS

```bash
cp .env.example .env
```

Windows

```bash
copy .env.example .env
```

---

## 4. Generate application key

```bash
php artisan key:generate
```

---

## 5. Configure Database

Open the `.env` file and update your database credentials.

Example:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tourpal
DB_USERNAME=root
DB_PASSWORD=
```

---

## 6. Create the database

Create a MySQL database named:

```
tourpal
```

---

## 7. Run migrations

```bash
php artisan migrate
```

Or if seeders are available:

```bash
php artisan migrate --seed
```

---

## 8. Storage Link

If the project stores uploaded files:

```bash
php artisan storage:link
```

---

## 9. Run the server

```bash
php artisan serve
```

The API will be available at:

```
http://127.0.0.1:8000
```

---

# 🔐 Authentication

The project uses:

-   Laravel Sanctum
-   Token Authentication

After login, include the generated token in every authenticated request.

Example:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 👥 Roles

The system uses **Spatie Laravel Permission**.

Available roles:

-   tourist
-   guide
-   host
-   admin

---

# 📂 Project Architecture

```
Request
      ↓
API Route
      ↓
Form Request
      ↓
Controller
      ↓
Service
      ↓
Model
      ↓
Database
```

Business Logic is implemented inside the **Service Layer**.

Controllers remain lightweight.

---

# 📡 API Base URL

```
http://127.0.0.1:8000/api
```

---

# 🚀 Running Tests (Optional)

```bash
php artisan test
```

---

# ⚠ Notes

-   PHP 8.2 or later is required.
-   Composer must be installed.
-   MySQL server must be running before executing migrations.
-   Never commit your `.env` file.
-   Always pull the latest changes before starting development.

---

# 👨‍💻 Development Team

TourPal Backend Development Team

Graduation Project – Software Engineering
