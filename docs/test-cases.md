# Test Cases

## Automated Unit Tests

| ID | Area | Scenario | Expected Result |
| --- | --- | --- | --- |
| UT-01 | CartService | Add two products to cart | Cart item list and cart total are calculated correctly |
| UT-02 | CartService | Replace a product quantity with zero | Product is removed and total is zero |
| UT-03 | CartService | Empty cart | In-memory cart and stored cart are both cleared |
| UT-04 | FilterPipe | Empty search text | Original product list is returned |
| UT-05 | FilterPipe | Search by product name | Matching products are returned |
| UT-06 | SortPipe | Sort by product name ascending | Products are ordered A to Z |
| UT-07 | SortPipe | Sort by product price high to low | Highest price appears first |

Run:

```powershell
$env:CHROME_BIN='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run test:ci
```

## Manual Regression Tests

| ID | Flow | Steps | Expected Result |
| --- | --- | --- | --- |
| MT-01 | Products page | Open `/products` | Product grid and cart panel render |
| MT-02 | Search | Search for `Surf` | Surf Excel remains visible |
| MT-03 | Sort | Select high-to-low price sort | Highest priced item appears first |
| MT-04 | Add to cart | Add one product | Cart count and total increase |
| MT-05 | Quantity | Increment and decrement a cart item | Quantity and total update |
| MT-06 | Billing validation | Open `/billing` with cart items and leave fields blank | Submit button remains disabled |
| MT-07 | Billing submit | Fill all required fields and submit | Checkout invoice page opens |
| MT-08 | New order | Click Place a New Order | Cart clears and products page opens |
| MT-09 | Legacy parity | Repeat MT-01 through MT-04 on `http://localhost:4206` | Core legacy behavior matches the migrated app |
