# Trend Shopping Ecommerce - Angular 21 Migration

This repository migrates the legacy Angular 6 ecommerce demo from
`ganeshkavhar/Ecommerce-app-with-Angular` to Angular 21 while preserving the
original shopping, billing, cart, and checkout flows.

## Migration Summary

This project started as a small Angular 6 shopping cart demo and was modernized
so it can build, run, and be tested with Angular 21.

| Item | Details |
| --- | --- |
| Original source | https://github.com/ganeshkavhar/Ecommerce-app-with-Angular |
| New repository | https://github.com/trpk75/ecommerce-app-angular-21-migration |
| Framework upgrade | Angular 6.1.7 to Angular 21.2.15 |
| Migrated app source | 26 source files, 1,141 non-test source lines |
| Preserved legacy source | 26 source files, 1,183 non-test source lines under `legacy-angular-6/` |
| Tests added | 7 unit tests for cart, filter, and sort logic |
| Documentation added | Migration guide, use cases, user stories, and test cases |

In plain terms: the original app was kept for comparison, the working app was
upgraded to the current Angular generation, common shopping behavior was tested,
and supporting documents were added so non-developers can understand what was
changed and why.

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
