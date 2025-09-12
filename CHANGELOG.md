# CHANGELOG

## [2025-01-09 23:00:00] - Bug Fix: Correct Story Swiper Navigation Direction (RTL)

**Date and Time of changes:** 2025-01-09 23:00:00

**Detailed description of changes:**
- Swapped `story-swiper-button-next` and `story-swiper-button-prev` classes to match RTL behavior
- Kept arrow icons visually consistent while fixing logical navigation
- Ensures right button goes to previous and left button goes to next as expected in RTL modals

**Components affected:**
- src/components/Story/Story.tsx
- package.json (version bumped to 0.14.01)

----

## [2025-01-09 22:55:00] - Feature Minor: Add Story View Status Tracking

**Date and Time of changes:** 2025-01-09 22:55:00

**Detailed description of changes:**
- Added automatic story status tracking when stories are viewed
- Implemented isActive status change from true to false when story is opened
- Added state management for displayStories to track story status changes
- Updated handleStoryClick function to mark stories as inactive (viewed)
- Stories now visually indicate their viewed status through isActive property
- Added real-time status updates in the story display list
- Implemented proper state synchronization between story list and modal
- Enhanced user experience by showing which stories have been viewed
- Added visual feedback for story completion status
- Improved story interaction tracking and user engagement metrics

**Components affected:**
- src/components/Story/Story.tsx
- package.json (version bumped to 0.14.00)

----

## [2025-01-09 22:50:00] - Bug Fix: Remove Story Modal Opening Animation

**Date and Time of changes:** 2025-01-09 22:50:00

**Detailed description of changes:**
- Completely removed all story modal opening and closing animations
- Removed all CSS keyframe animations for modal and overlay
- Eliminated animation-related state management (isAnimating state)
- Removed animation classes and timing functions from modal JSX
- Simplified modal opening and closing logic without delays
- Removed all animation-related CSS classes and keyframes
- Streamlined component code by removing animation complexity
- Modal now opens and closes instantly without any visual effects
- Improved performance by eliminating animation overhead
- Cleaner, simpler modal implementation without animation dependencies

**Components affected:**
- src/index.css
- src/components/Story/Story.tsx
- package.json (version bumped to 0.13.00)

----

## [2025-01-09 22:45:00] - Feature Minor: Enhance Story Modal Opening Animation

**Date and Time of changes:** 2025-01-09 22:45:00

**Detailed description of changes:**
- Completely redesigned story modal opening animation for more dynamic and modern feel
- Added 3-stage opening animation with scale, rotation, and translation effects
- Implemented bounce effect using cubic-bezier(0.34, 1.56, 0.64, 1) easing function
- Added rotation effects: -10deg to 0deg on open, 0deg to 10deg on close
- Enhanced scale animation: 0.3 to 1.0 with intermediate 0.9 stage for bounce effect
- Added backdrop blur animation (0px to 8px) for better visual depth
- Increased animation duration from 0.3s to 0.5s for smoother, more dramatic effect
- Updated closing animation with reverse rotation and upward translation
- Improved timing functions for more natural and engaging animations
- Added intermediate opacity stage (0.7) for smoother transition
- Enhanced overall user experience with more polished and professional animations

**Components affected:**
- src/index.css
- src/components/Story/Story.tsx
- package.json (version bumped to 0.12.00)

----

## [2025-01-09 22:40:00] - Bug Fix: Optimize Story Modal Space Usage

**Date and Time of changes:** 2025-01-09 22:40:00

**Detailed description of changes:**
- Significantly reduced empty space in story modal for better content density
- Reduced image height from h-80 to h-64 (256px) for more compact layout
- Added padding around images (p-4) and rounded corners for better visual appeal
- Reduced content section padding from p-6 to p-4 for tighter spacing
- Decreased header padding from p-6 pt-20 to p-4 pt-16 for space efficiency
- Reduced progress bar padding from p-4 to p-3 for minimal overhead
- Adjusted text sizes: title from text-xl to text-lg, description from text-base to text-sm
- Reduced button padding and text size for more compact action area
- Decreased margins and gaps throughout the modal for better space utilization
- Maintained responsive design while optimizing for both mobile and desktop
- Added rounded-lg to images for modern visual appeal

**Components affected:**
- src/components/Story/Story.tsx
- package.json (version bumped to 0.11.00)

----

## [2025-01-09 22:35:00] - Bug Fix: Fix Desktop Layout Issues in Story Modal

**Date and Time of changes:** 2025-01-09 22:35:00

**Detailed description of changes:**
- Fixed desktop layout issue where images were too large and covered bottom content
- Adjusted image height to h-80 on desktop while maintaining full height on mobile
- Restructured layout with proper flex containers to ensure content visibility
- Reduced text size from text-lg to text-base for better content fitting
- Adjusted spacing and margins for better content distribution
- Added min-h-0 to content section to prevent overflow issues
- Ensured action buttons are always visible at the bottom of the modal
- Maintained responsive design with proper mobile/desktop differentiation
- Improved overall layout balance and content accessibility

**Components affected:**
- src/components/Story/Story.tsx
- package.json (version bumped to 0.10.00)

----

## [2025-01-09 22:30:00] - Feature Minor: Add Story Modal Animations and Auto-Close

**Date and Time of changes:** 2025-01-09 22:30:00

**Detailed description of changes:**
- Added smooth opening and closing animations for story modal
- Implemented auto-close functionality when last progress bar completes
- Added CSS keyframe animations for modal and overlay transitions
- Created scale and fade effects for modal opening/closing
- Added 500ms delay before auto-closing to allow users to see completion
- Enhanced user experience with smooth transitions and visual feedback
- Implemented proper animation state management with isAnimating state
- Added overlay fade animations for better visual hierarchy
- Optimized animation timing for better performance and user experience
- Maintained all existing functionality while adding new animation features

**Components affected:**
- src/components/Story/Story.tsx
- src/index.css
- package.json (version bumped to 0.09.00)

----

## [2025-01-09 22:25:00] - Feature Major: Complete Story Component Redesign with Progress Bar

**Date and Time of changes:** 2025-01-09 22:25:00

**Detailed description of changes:**
- Completely redesigned Story component with modern, wider layout
- Added animated progress bar showing story progression with smooth transitions
- Increased modal width to 90vw with max-width of 4xl for better content display
- Implemented Instagram-style progress bars at the top of each story
- Added profile picture and story counter in header section
- Enhanced navigation buttons with backdrop blur and improved shadows
- Redesigned action buttons with gradient backgrounds and hover animations
- Added smooth hover effects and transitions throughout the component
- Implemented better spacing and typography with larger text sizes
- Added gradient background to content section for modern look
- Enhanced mobile responsiveness with full-screen modal on mobile devices
- Fixed TypeScript linter errors and improved code quality
- Updated CSS with modern styling including backdrop filters and shadows

**Components affected:**
- src/components/Story/Story.tsx
- src/index.css
- package.json (version bumped to 0.08.00)

----

## [2025-01-09 22:20:00] - Bug Fix: Improve Story Modal Responsive Height

**Date and Time of changes:** 2025-01-09 22:20:00

**Detailed description of changes:**
- Updated Story modal height to be responsive: 80vh on desktop and 100vh on mobile
- Improved image height within modal: h-96 on desktop and h-80 on mobile
- Fixed TypeScript error by properly typing swiper parameter
- Enhanced responsive design for better mobile and desktop experience
- Maintained proper aspect ratios and layout proportions across devices

**Components affected:**
- src/components/Story/Story.tsx
- package.json (version bumped to 0.07.00)

----

## [2025-01-09 22:15:00] - Feature Minor: Enhance Story Component with Multiple Images Support

**Date and Time of changes:** 2025-01-09 22:15:00

**Detailed description of changes:**
- Enhanced Story component to support multiple images per story using Swiper library
- Added StoryImage interface for individual image data with descriptions
- Implemented Swiper slider with navigation buttons and pagination dots
- Added image counter display showing current image position (e.g., "2 / 3")
- Created dynamic description display that changes based on current image
- Added autoplay functionality with 3-second delay between images
- Implemented smooth transitions and hover effects for navigation buttons
- Added custom CSS styling for story swiper components
- Updated default stories with multiple images and descriptions
- Added proper TypeScript interfaces for enhanced story data structure
- Implemented fallback to single image if no multiple images provided
- Added proper state management for current image index tracking

**Components affected:**
- src/components/Story/Story.tsx
- src/index.css
- package.json (version bumped to 0.06.00)

----

## [2025-01-09 22:00:00] - Feature Minor: Add Story Component for Home Page

**Date and Time of changes:** 2025-01-09 22:00:00

**Detailed description of changes:**
- Created new Story component with Instagram-like story functionality
- Added horizontal scrollable story display with circular profile images
- Implemented story modal with full-screen overlay for detailed view
- Added gradient borders for active stories and gray borders for inactive ones
- Created responsive design with proper mobile and desktop layouts
- Added default story data with product images and descriptions
- Implemented click-to-open modal functionality with close button
- Added action buttons for viewing products and sharing
- Integrated component into Home page above HeroSlider
- Added custom CSS utilities for hiding scrollbars
- Implemented proper TypeScript interfaces for story data structure
- Added error handling for image loading with fallback images

**Components affected:**
- src/components/Story/Story.tsx
- src/components/Story/index.ts
- src/pages/Home.tsx
- src/index.css
- package.json (version bumped to 0.05.00)

----

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
