# Trend Shopping Ecommerce - Angular 21 Migration

This repository migrates the legacy Angular 6 ecommerce demo from
`ganeshkavhar/Ecommerce-app-with-Angular` to Angular 21 while preserving the
original shopping, billing, cart, and checkout flows.

## Applications

- Migrated Angular 21 app: repository root.
- Legacy Angular 6 snapshot: `legacy-angular-6/`.

## Prerequisites

- Node.js 24.x was used for this migration.
- npm 11.x was used for dependency installation.
- Microsoft Edge can be used as the headless test browser by setting
  `CHROME_BIN` to `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.

## Run the Migrated Angular 21 App

```powershell
npm install
npm run build
npm run start:migrated
```

Open `http://localhost:4200/products`.

## Run the Legacy Angular 6 App

```powershell
npm run build:legacy
npm run start:legacy
```

Open `http://localhost:4206/products`.

The Angular 6 build uses `NODE_OPTIONS=--openssl-legacy-provider` because its
webpack version is not compatible with modern OpenSSL defaults.

## Test

```powershell
$env:CHROME_BIN='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run test:ci
```

## Documentation

- [Migration guide](docs/migration-guide.md)
- [Use cases](docs/use-cases.md)
- [User stories](docs/user-stories.md)
- [Test cases](docs/test-cases.md)
