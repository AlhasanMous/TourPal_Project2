# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

TourPal is a tourism platform backend/API built with **Laravel 12** and PHP 8.2+. It exposes a RESTful API at `/api` for tourists, guides, hosts, and admins. The project also includes a small React + Tailwind admin SPA served through Laravel at `/dashboard`.

### Tech stack

- PHP 8.2+
- Laravel 12
- MySQL (default in `.env` is `DB_CONNECTION=mysql`)
- Laravel Sanctum (`^4.0`) with token-based authentication
- Spatie Laravel Permission (`6.25`) for roles
- React 19 + Tailwind CSS 4 + Vite 7 for the frontend admin SPA

## Common commands

### Setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
# configure DB credentials in .env, then:
php artisan migrate --seed
php artisan storage:link
```

The `composer.json` also provides a combined setup script:

```bash
composer run setup
```

This installs dependencies, copies `.env.example` to `.env`, generates the key, runs migrations, installs npm dependencies, and builds the frontend.

### Development server

```bash
# Backend only
php artisan serve

# Frontend only
npm run dev

# Backend + queue + logs + Vite concurrently
composer run dev
```

Default URLs:

- API base: `http://127.0.0.1:8000/api`
- Web: `http://127.0.0.1:8000`
- Dashboard: `http://127.0.0.1:8000/dashboard`

### Migrations and seeders

```bash
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=AdminSeeder
```

Default admin credentials (from `database/seeders/AdminSeeder.php`):

- Email: `admin@tourpal.sy`
- Password: `Admin@123456`

Roles are defined in `database/seeders/RoleSeeder.php`: `tourist`, `guide`, `host`, `admin`.

### Build and assets

```bash
npm run build   # production Vite build
npm run dev     # Vite dev server with HMR
php artisan storage:link
```

### Testing

```bash
# Run the full test suite
php artisan test

# Run a single test file
php artisan test tests/Feature/ExampleTest.php

# Run a single test method
php artisan test --filter=test_name

# Run only PHPUnit directly
vendor/bin/phpunit
vendor/bin/phpunit --filter test_name
```

`phpunit.xml` configures tests to run with an in-memory SQLite database (`DB_DATABASE=:memory:`).

### Code style / linting

```bash
./vendor/bin/pint          # Laravel Pint (PHP code style)
./vendor/bin/pint --test   # dry-run only
```

## High-level architecture

### Request flow

```
Request
  ↓
API Route (routes/api.php)
  ↓
Form Request (app/Http/Requests/)
  ↓
Controller (app/Http/Controllers/Api/...)
  ↓
Service (app/Services/)
  ↓
Model (app/Models/)
  ↓
Database
```

Business logic lives in the **Service layer**. Controllers are kept lightweight: they validate via Form Requests, delegate to Services, and return JSON through Resources.

### Directory conventions

- `app/Http/Controllers/Api/` — API controllers. Sub-namespaces like `Api\Admin` for admin-only endpoints.
- `app/Http/Requests/` — Form Request classes grouped by domain, e.g. `Auth/`, `City/`, `Place/`, `Workspace/`.
- `app/Http/Resources/` — API Resources for serializing models.
- `app/Services/` — Domain services containing business logic.
- `app/Models/` — Eloquent models.
- `app/Policies/` — Authorization policies; registered in `AppServiceProvider::boot()` via `Gate::policy()`.

### Routes

- `routes/api.php` defines the API under `/api`.
- `routes/web.php` serves the welcome page and the React admin SPA (`/dashboard` → `resources/views/app.blade.php`).
- `routes/console.php` contains any custom Artisan commands.

Important route patterns (from `routes/api.php`):

- Public auth: `POST /api/auth/register`, `POST /api/auth/login`
- Public data: `GET /api/cities`, `GET /api/places`, `GET /api/places/{place}`
- Protected by Sanctum: `POST /api/auth/logout`, `GET /api/auth/me`
- Admin only (`auth:sanctum` + `role:admin`): `/api/admin/cities`, `/api/admin/places`

Note: `Route::apiResource('workspaces', WorkspaceController::class)` is currently inside the public auth prefix group; verify whether this is intentional as the controller requires authentication.

### Authentication

- The default guard in `config/auth.php` is `api`, using the `sanctum` driver.
- Users authenticate with an email + `password_hash` (the `users` table uses `password_hash`, not Laravel's default `password`).
- Successful login/register issues a Sanctum `plainTextToken` returned as `token`.
- Send `Authorization: Bearer <token>` for protected routes.

### Roles and permissions

- Spatie Laravel Permission is configured with guard `api` (`config/permission.php` -> `defaults.guard = 'api'`).
- Roles must be created with `guard_name => 'api'` (see `RoleSeeder`).
- Use route middleware `role:admin` to restrict endpoints by role.
- The only currently registered policy is `WorkspacePolicy` for the `Workspace` model.

### Frontend SPA

- Entry: `resources/js/app.jsx` mounts a `BrowserRouter`.
- Vite config (`vite.config.js`) loads `resources/css/app.css` and `resources/js/app.jsx`.
- React pages are in `resources/js/pages/`. Several dashboard routes in `resources/js/routes/AppRoutes.jsx` are currently commented out.
- Shared API client: `resources/js/services/api.js` — Axios instance with `baseURL: '/api'` and `withCredentials: true`.

### Notable implementation details

- The `User` model uses `password_hash` as the password column and casts it as `hashed`. Authentication code calls `Hash::check()` directly in `AuthService`.
- `Place` deletes related `WorkspaceTimelineItem` records in a `static::deleting` model event.
- `Workspace` uses a `WorkspacePolicy` for `view`, `update`, and `delete` authorization.
- Migrations contain some Arabic inline comments; English or Arabic comments both appear.
- The `.env` default database name is `Tourpal_project2` and uses MySQL. SQLite is used only during testing via `phpunit.xml`.
- `composer run dev` runs the server, queue listener, logs (`pail`), and Vite concurrently.

### Database

- Migrations live in `database/migrations/`.
- Factories in `database/factories/`.
- Seeders in `database/seeders/`; `DatabaseSeeder.php` calls `RoleSeeder` and `AdminSeeder`.
- There is a `Tourpal_project2` SQLite file at the project root (legacy or local scratch file); the application is configured to connect to MySQL.
