# TODO: Fix Product Search Errors and Enforce Validated Products for Visitors

## Tasks
- [x] Fix search errors in product.service.ts by removing 'mode: insensitive'
- [x] Enforce validated products only for visitors/non-managers in product.controller.ts getAll method
- [x] Update frontend ProductResponse interface to use 'total' instead of 'count'
- [x] Adjust list.ts to use 'total' from response
- [x] Test the changes: verify search works and visitors only see validated products
