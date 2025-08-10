# CHANGELOG

## [2025-01-09 21:45:00] - Refactor: Remove selectedCategoryTitle functionality from Search page

**Date and Time of changes:** 2025-01-09 21:45:00

**Detailed description of changes:**
- Removed selectedCategoryTitle useMemo hook and related logic from Search.tsx
- Removed selectedCategoryTitle from filter display section in JSX
- Cleaned up category filter display logic by removing category title display
- Simplified filter display to only show brand and price range filters
- Maintained category selection functionality while removing title display

**Components affected:**
- src/pages/Search.tsx
- package.json (version bumped to 0.04.00)

----

## [2025-01-09 21:30:00] - Refactor: Remove parentCategoryId functionality from Search page

**Date and Time of changes:** 2025-01-09 21:30:00

**Detailed description of changes:**
- Removed parentCategoryId parameter and related functionality from Search.tsx
- Cleaned up unused imports: useFindManyProductCategoriesQuery, getFindManyProductCategoriesQueryQueryKey, Env
- Removed parentProductCategories API query and related useEffect
- Removed handleParentCategoryClick function
- Removed parentCategoryId from URL parameters and dependency arrays
- Simplified search page logic by removing unnecessary parent category filtering

**Components affected:**
- src/pages/Search.tsx
- package.json (version bumped to 0.03.00)

----

## [2025-01-09 21:15:00] - Feature Minor: Add Floating Contact Button Component

**Date and Time of changes:** 2025-01-09 21:15:00

**Detailed description of changes:**
- Created new FloatingContactButton component with contact menu popup
- Added contact options: Store contact, Sales support, WhatsApp, Telegram, and Instagram
- Implemented floating button with phone icon that transforms to close icon when menu is open
- Added responsive design with proper positioning and z-index
- Integrated component into WebsiteLayout for global availability
- Added hover effects and smooth transitions for better UX
- Implemented proper TypeScript interfaces for contact options
- Added external link handling for social media and phone contacts
- Added full-screen overlay when menu is open for better UX
- Implemented click-outside-to-close functionality on overlay

**Components affected:**
- src/components/FloatingContactButton/FloatingContactButton.tsx
- src/components/FloatingContactButton/index.ts
- src/layouts/WebsiteLayout.tsx
- package.json (version bumped to 0.02.00)

----

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
