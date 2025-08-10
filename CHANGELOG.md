# CHANGELOG

## [2025-01-09 20:30:00] - Feature Minor: Add API-driven categories to MobileMenuDrawer component

**Date and Time of changes:** 2025-01-09 20:30:00

**Detailed description of changes:**
- Integrated category tree API into MobileMenuDrawer component similar to MegaMenu implementation
- Added API call using `useFindProductCategoriesTreeQuery` to fetch hierarchical categories
- Implemented data transformation logic to convert API response to mobile menu structure
- Added loading and error states for better user experience
- Updated TypeScript interfaces to support numeric IDs from API
- Replaced hardcoded category data with dynamic API-driven content
- Added proper routing with Link components for navigation
- Implemented three-level category hierarchy support (root -> level2 -> level3)
- Added "همه" (All) options for each category level

**Components affected:**
- src/components/MobileMenuDrawer/MobileMenuDrawer.tsx
- package.json (version bumped to 0.01.00)

----
