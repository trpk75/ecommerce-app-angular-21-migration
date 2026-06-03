# Angular 6 → Angular 21 Migration Code Review

**Source repo:** `ganeshkavhar/Ecommerce-app-with-Angular` (Angular 6.1.7)
**Target repo:** `trpk75/ecommerce-app-angular-21-migration` (Angular 21.2.15)
**Review date:** June 3, 2026

---

## Executive Summary

The migration successfully brings a working Angular 6 shopping-cart demo up to Angular 21 and produces a clean build. The dependency graph, build toolchain, TypeScript configuration, and runtime behaviours are correctly updated. Documentation is thorough and a useful test suite has been added. However, the migration is deliberately conservative: it preserves the legacy NgModule architecture rather than adopting modern Angular idioms, leaves strict-mode type-checking disabled, and does not take advantage of signals, standalone components, or the built-in control-flow syntax introduced since Angular 17. Several quality, security, and maintainability gaps remain.

**Overall verdict: Passes as a functional migration. Requires follow-on work before it can be considered production-ready.**

---

## 1. What Was Done Well

### 1.1 Dependency Upgrade
All first-party Angular packages are consistently pinned to `21.2.15` / `21.2.12`. RxJS was moved from 6.x to 7.8.x, `zone.js` from `0.8.x` to `0.16.x`, and TypeScript from `~2.7.2` to `~5.9.3`. The legacy `core-js` polyfill bundle was correctly removed; Angular 21 handles polyfills via `angular.json`. Bootstrap 4.6.2 was retained, which is a sensible choice to avoid cascading visual regressions.

### 1.2 Build System
`angular.json` correctly switches the builder from the old `@angular-devkit/build-angular:browser` to `@angular/build:application` (the esbuild-based Application Builder introduced in Angular 17). This alone yields significantly faster cold builds and better tree-shaking.

### 1.3 TypeScript Configuration
`tsconfig.json` targets ES2022 with `"module": "ES2022"` and `"moduleResolution": "bundler"` — appropriate for the new build system. `experimentalDecorators: true` is kept because the app still uses decorator-based components.

### 1.4 Legacy Snapshot
Keeping the original source under `legacy-angular-6/` with a `--legacy-peer-deps` / `--openssl-legacy-provider` workaround is excellent practice — it allows direct regression comparison without needing a separate repository.

### 1.5 Bug Fixes Documented
The migration guide explicitly calls out two real bugs that were fixed: cart-clearing desync between service state and storage, and improper full-page redirects replaced with Angular Router navigation. These are substantive improvements over the source.

### 1.6 Documentation
Four docs files (migration guide, use cases, user stories, test cases) provide non-developer-readable context that the original repo lacked entirely. The migration guide documents verified build and test results with a specific date.

### 1.7 Tests Added
Seven unit tests covering cart behaviour and product filtering/sorting were added. The original app had zero tests. A CI-compatible `test:ci` script with ChromeHeadless (or Edge) is provided.

---

## 2. Critical Issues

### 2.1 NgModule Not Migrated to Standalone Components
**Severity: High**

The migration explicitly preserved the NgModule architecture with `standalone: false` on all declarations. While this is technically valid in Angular 21, NgModule-based architecture has been soft-deprecated since Angular 17. Angular 21 scaffolding generates standalone components by default, and the Angular team's recommended migration path is to adopt standalone. Leaving this as-is means the codebase misses:

- Improved tree-shaking and bundle size
- Simpler lazy routing without `loadChildren` module wrapping
- The ability to use `inject()` at construction time without DI token gymnastics

**Recommendation:** Run `ng generate @angular/core:standalone` migration schematic to convert declarations, then remove `AppModule` in favour of `bootstrapApplication` with `provideRouter` and `provideHttpClient`.

### 2.2 Strict Type-Checking Disabled
**Severity: High**

`tsconfig.json` sets `"strict": false`, `"strictTemplates": false`, and `"strictInputAccessModifiers": false`. These were likely disabled to get the migration to compile quickly, but they leave a large class of type errors silently undetected:

- Template type-safety is off — binding mismatches, wrong event payload types, and null-access bugs will not surface at build time.
- `noImplicitReturns: false` allows functions to fall off without returning a value.
- `noImplicitOverride: true` is the only strict flag enabled, which is inconsistent.

**Recommendation:** Enable `"strict": true` and `"strictTemplates": true`. Fix the resulting type errors rather than suppressing them — for a 26-file, 1,141-line codebase this should be manageable in a day.

### 2.3 No HTTP Client / No Environment Configuration
**Severity: High**

The source app uses hard-coded in-memory product data. The migration preserves this pattern. There is no `HttpClient`, no `environment.ts` / `environment.prod.ts`, and no `provideHttpClient()` in the app configuration. This means:

- The app cannot be connected to a real product API without architectural changes.
- There is no way to point at different backends for development vs. production.

**Recommendation:** Add `src/environments/environment.ts` and `environment.prod.ts` with a `apiUrl` field. Add `provideHttpClient()` and a `ProductService` that fetches from that URL. The mock data array can serve as a fallback when the API is unavailable.

---

## 3. Angular-Specific Modernisation Gaps

### 3.1 Old-Style Structural Directives (*ngIf, *ngFor, *ngSwitch)
Angular 17 introduced built-in control-flow (`@if`, `@for`, `@switch`) as an alternative to structural directives. The new syntax is more readable, avoids the need to import `CommonModule` in standalone components, and enables better change-detection optimisations. The migrated templates still use `*ngIf` and `*ngFor`.

**Recommendation:** Run `ng generate @angular/core:control-flow` migration schematic to convert all templates automatically.

### 3.2 No Signals
Angular 16+ introduced Signals as a fine-grained reactivity primitive. The cart service and product state management rely on mutable class properties and manual `EventEmitter` / Subject patterns that require the Zone.js change-detection cycle to pick up changes. Signals would make the reactive data flow explicit and enable zoneless change detection in future.

**Recommendation:** Refactor `CartService` to expose `signal<CartItem[]>` and `computed()` totals. This is a medium-effort change but dramatically improves change-detection efficiency.

### 3.3 Router Still Uses `RouterModule.forRoot()` Pattern
Modern Angular uses `provideRouter(routes)` in the application config instead of importing `RouterModule.forRoot()` inside an NgModule. The migrated app still uses the module-based approach.

**Recommendation:** Migrate to `provideRouter(routes)` as part of the standalone component migration.

### 3.4 No Lazy Loading
All routes appear to be eagerly loaded via a single `AppRoutingModule`. For a small demo this is acceptable, but a production migration should introduce `loadComponent` (standalone) or `loadChildren` (module) lazy routes for at least the Cart and Billing views to keep the initial bundle small.

### 3.5 `zone.js` Still Required
The `polyfills` array in `angular.json` includes `zone.js`, meaning the app relies on Zone-based change detection. Zoneless change detection (stable in Angular 18+) offers better performance and simpler debugging, but requires Signals for reactivity.

---

## 4. Code Quality Issues

### 4.1 No ESLint Configuration
The original used TSLint (deprecated since 2020). The migrated project has no ESLint setup. Without a linter, style inconsistencies and anti-patterns will accumulate.

**Recommendation:** Run `ng add @angular-eslint/schematics` to scaffold ESLint with Angular-specific rules. Add a `"lint": "ng lint"` script to CI.

### 4.2 Duplicate `start` and `start:migrated` Scripts
`package.json` defines two scripts with identical commands:
```json
"start": "ng serve --host 0.0.0.0 --port 4200",
"start:migrated": "ng serve --host 0.0.0.0 --port 4200"
```
`start:migrated` is redundant — it exists only to document intent but adds confusion.

### 4.3 Test Coverage is Minimal
Seven tests covering only cart mutation and list filtering/sorting leaves the entire routing layer, form validation, component rendering, and billing logic untested. The test file count also doesn't reflect the 26-component file count.

**Recommendation:** Target at minimum: one smoke test per component (renders without throwing), service method coverage for all public methods, and one integration test for the checkout flow.

### 4.4 No CI Pipeline
There is no `.github/workflows/` directory. Without CI, the test suite and build verification must be run manually and are easily forgotten.

**Recommendation:** Add a GitHub Actions workflow that runs `npm run build` and `npm run test:ci` on every push and pull request.

### 4.5 `--host 0.0.0.0` in Development Server
Binding to all interfaces by default is a security concern when running on developer machines connected to shared networks.

**Recommendation:** Change the default to `ng serve` (localhost only) and document the `--host 0.0.0.0` option for containerised environments separately.

---

## 5. UI / Functional Parity Review

Based on the documented use cases, all five original flows are accounted for:

| Use Case | Source (Angular 6) | Migration | Status |
|---|---|---|---|
| UC-01 Browse products | ✅ Product grid | ✅ Preserved | ✅ Parity |
| UC-02 Search products | ✅ Filter by name | ✅ Preserved + tested | ✅ Parity |
| UC-03 Sort products | ✅ By name/price | ✅ Preserved + tested | ✅ Parity |
| UC-04 Manage cart | ✅ Add/remove/clear | ✅ Fixed desync bug | ✅ Improved |
| UC-05 Checkout/billing | ✅ Form → invoice | ✅ Fixed navigation bug | ✅ Improved |

No features appear to have been dropped. Two bugs in the source were fixed. The Bootstrap 4 class names were preserved, maintaining visual parity.

**Gaps not addressed (not regressions, but unimplemented improvements):**
- No responsive breakpoint testing documented
- No ARIA roles or accessibility attributes added
- No form validation feedback beyond HTML5 `required`
- No success/failure state handling for the order confirmation flow

---

## 6. Recommended Follow-On Work (Prioritised)

| Priority | Action | Effort |
|---|---|---|
| P1 | Enable `strict: true` and `strictTemplates: true`; fix compile errors | 1–2 days |
| P1 | Add GitHub Actions CI pipeline (build + test) | 2 hours |
| P1 | Add ESLint via `ng add @angular-eslint/schematics` | 1 hour |
| P2 | Migrate to standalone components using schematic | 2–3 days |
| P2 | Convert templates to `@if`/`@for` control flow syntax | 2 hours (schematic) |
| P2 | Add environment files and `HttpClient`-backed `ProductService` | 1–2 days |
| P3 | Refactor `CartService` to use Signals | 1–2 days |
| P3 | Add lazy routes for Cart and Billing | 4 hours |
| P3 | Expand test coverage (components + integration) | 3–5 days |
| P3 | Zoneless change detection (`provideZoneChangeDetection({eventCoalescing: true})`) | 4 hours |

---

## 7. Angular 21 Features Not Yet Leveraged

For completeness, the following Angular 21-era capabilities were available but not adopted in this migration. None are blocking, but they represent the full modernisation potential:

- **`@let` template variables** (Angular 18+) — simplify async pipe patterns
- **Deferred views (`@defer`)** (Angular 17+) — lazy-render heavy sections like the product grid
- **Resource API** (Angular 19+) — declarative async data loading with built-in loading/error state
- **Event replay with SSR** (Angular 19+) — if server-side rendering is added later
- **Vitest support** (Angular 20+) — faster unit test runner than Karma

---

*End of review*
