# Angular 6 to Angular 21 Migration Guide

## Source

The migration started from `ganeshkavhar/Ecommerce-app-with-Angular`, commit
`35e0841`.

## Target

- Angular packages: `21.2.15`
- Angular CLI/build packages: `21.2.12`
- TypeScript: `~5.9.3`
- RxJS: `^7.8.2`
- Zone.js: `~0.16.0`
- Bootstrap: `4.6.2`

Bootstrap 4 was retained to preserve the original class names and visual layout.

## Key Changes

- Replaced Angular CLI 6 workspace configuration with Angular 21 builders.
- Updated root TypeScript configuration for ES2022 and current Angular compiler options.
- Removed obsolete `core-js` polyfills; Angular 21 polyfills are configured in `angular.json`.
- Marked all legacy NgModule declarations as `standalone: false`.
- Preserved the existing NgModule and router structure instead of rewriting to standalone components.
- Fixed cart clearing so service state and storage stay synchronized.
- Replaced full-page checkout/billing redirects with Angular router navigation.
- Fixed legacy template type issues for product search and cart refresh events.
- Added focused unit tests for cart behavior and product filtering/sorting.

## Legacy App

The original Angular 6 app is kept under `legacy-angular-6/` for comparison and
local hosting. Its dependency tree is intentionally isolated from the Angular 21
app. Modern npm requires `--legacy-peer-deps`, and modern Node requires
`NODE_OPTIONS=--openssl-legacy-provider` for the old webpack build.

## Verification

Validated on June 3, 2026:

- `npm run build` completed successfully for the Angular 21 app.
- `npm run test:ci` completed successfully with 7 passing specs in headless Edge.
- Legacy Angular 6 build completed successfully with the OpenSSL compatibility flag.
