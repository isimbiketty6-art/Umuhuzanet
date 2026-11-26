# Backend integration notes

These files are a starter patch for a fresh Laravel project, not a complete Laravel installation.

## Important setup details
1. Create a fresh Laravel app and install Sanctum:
   ```bash
   composer create-project laravel/laravel backend-app
   cd backend-app
   php artisan install:api
   ```
   If your Laravel version uses a different Sanctum installation flow, follow that version's official Laravel docs.
2. Merge these starter files into the matching paths.
3. Confirm `User` allows the intended profile fields only through validated update endpoints; do not add unrestricted mass assignment.
4. Configure `auth:sanctum`, CORS and stateful SPA domains before enabling authenticated frontend requests.
5. Run migrations and seed local demo data:
   ```bash
   php artisan migrate --seed
   ```
6. The demo API routes currently use Sanctum on write endpoints. Add explicit policies, employer ownership checks, verified-company checks, admin moderation routes, request throttling, and tests before production.
7. `DashboardController` currently allows an optional unauthenticated dashboard request but only returns public job counts and zero private counts. Protect it with `auth:sanctum` if your dashboard must be personal.
8. Add tests for application duplication, unauthorized role access, unpublished jobs, product validation, and tenant/company ownership.
