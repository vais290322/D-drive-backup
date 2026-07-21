# SmartShop E-Commerce Platform - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Modern E-Commerce)

**Primary References:** Shopify (product presentation), Amazon (functionality & trust), Swiggy/Zomato (local delivery aesthetics)

**Justification:** SmartShop is an experience-focused, visual-rich e-commerce platform requiring strong visual appeal to drive conversions while maintaining exceptional usability across four distinct user roles.

**Key Design Principles:**
- Build immediate trust through clean, professional aesthetics
- Emphasize product imagery and clear call-to-action hierarchy
- Role-based visual distinction for different dashboards
- Mobile-first responsive design with touch-optimized interfaces
- Localized feel with map integration prominence

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary Brand: 142 71% 45% (professional teal-green, trustworthy)
- Primary Hover: 142 71% 38%
- Secondary: 220 13% 18% (charcoal for text hierarchy)
- Accent: 25 95% 53% (vibrant orange for CTAs, limited use)
- Success: 142 76% 36% (order confirmation)
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white cards)
- Border: 220 13% 91%
- Text Primary: 220 13% 18%
- Text Secondary: 220 9% 46%

**Dark Mode:**
- Primary Brand: 142 50% 55%
- Primary Hover: 142 50% 48%
- Secondary: 220 13% 91%
- Accent: 25 95% 58%
- Success: 142 60% 42%
- Background: 220 13% 10%
- Surface: 220 13% 14%
- Border: 220 13% 25%
- Text Primary: 220 13% 91%
- Text Secondary: 220 9% 65%

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - UI, body text, clean & modern
- Headings: 'Poppins' (Google Fonts) - Hero sections, category titles, friendly & bold

**Type Scale:**
- Hero: 3.5rem / 4rem (font-bold, Poppins)
- H1: 2.25rem / 2.5rem (font-bold, Poppins)
- H2: 1.875rem / 2rem (font-semibold, Poppins)
- H3: 1.5rem / 1.75rem (font-semibold, Inter)
- Body: 1rem / 1.5rem (font-normal, Inter)
- Small: 0.875rem / 1.25rem (font-normal, Inter)
- Button: 0.875rem / 1rem (font-medium, Inter)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 (mobile), p-6 (desktop)
- Section spacing: py-12 (mobile), py-20 (desktop)
- Card gaps: gap-4 (mobile), gap-6 (desktop)
- Grid gaps: gap-4 to gap-8

**Container Widths:**
- Max content: max-w-7xl
- Product grids: max-w-8xl
- Forms: max-w-md
- Dashboards: max-w-full with px-4 to px-8

**Responsive Grid:**
- Products: grid-cols-2 (mobile), md:grid-cols-3, lg:grid-cols-4, xl:grid-cols-5
- Categories: grid-cols-2 (mobile), md:grid-cols-4, lg:grid-cols-6
- Dashboard cards: grid-cols-1 (mobile), md:grid-cols-2, lg:grid-cols-3

### D. Component Library

**Navigation:**
- Sticky header with logo (left), category mega-menu (center), cart/profile (right)
- Mobile: Bottom navigation bar with Home, Categories, Orders, Profile icons
- Role-specific sidebar for dashboards (collapsible on mobile)

**Product Cards:**
- Aspect ratio 4:5 product image with hover zoom effect
- Product name (2 lines max, ellipsis)
- Price (large, bold) with original price strikethrough if discounted
- Star rating + review count
- Three prominent buttons stacked vertically: "Order Online" (primary), "Order by Call" (outline), "Order on WhatsApp" (outline with WhatsApp green tint)

**Forms:**
- Floating labels for inputs
- Full-width fields with rounded-lg borders
- Clear validation states with inline error messages
- Touch-friendly 44px minimum height for mobile inputs

**Buttons:**
- Primary: Filled with brand color, rounded-lg, font-medium
- Secondary: Outline with border-2, rounded-lg
- Tertiary: Ghost (text only with hover background)
- Icon buttons: Circular for map markers, square for dashboard actions
- Size variants: sm (32px), md (40px), lg (48px)

**Data Displays:**
- Order cards: Timeline-style status with checkpoints
- Loyalty points: Circular progress indicator with point count center
- Dashboard stats: Large number (3rem) with small label below, icon left
- Tables: Zebra striping, sticky headers, mobile card fallback

**Map Integration:**
- Full-width map embed with custom markers
- Delivery radius shown as semi-transparent circle overlay
- Store location as prominent pin with brand color
- Customer address markers in accent color

**Overlays:**
- Modals: max-w-2xl with backdrop blur, rounded-xl, shadow-2xl
- Drawers: Slide from right for cart, filters
- Toasts: Top-right corner, auto-dismiss, with icon + message

### E. Animations

**Use Sparingly:**
- Product card hover: scale-105 transition-transform duration-200
- Button interactions: Native browser states only
- Page transitions: Fade-in on route change (300ms)
- Cart badge: Pulse once on item add
- Map zoom: Smooth pan to selected marker

## Role-Specific Design Patterns

**Customer Interface:** Consumer-friendly with large product imagery, prominent CTAs, playful illustrations for empty states

**Admin Dashboard:** Data-dense tables, chart visualizations, batch action controls, settings panels with clear hierarchy

**Staff Panel:** Task-focused with kanban-style order cards, quick-action buttons, minimal chrome

**Delivery Partner:** Map-centric design, route optimization display, large "Mark Delivered" CTAs, minimal distractions

## Images

**Hero Section:** YES - Large hero image required
- Full-width hero showcasing fresh products or delivery in action
- Height: 60vh (mobile), 75vh (desktop)
- Overlay: Subtle dark gradient (bottom-to-top) for text readability
- CTA buttons on hero: Blurred background (backdrop-blur-sm bg-white/10)

**Additional Images:**
- Category banners: Horizontal aspect 3:1 with category name overlay
- Product images: High-quality 4:5 aspect ratio, white/minimal background
- Trust badges: Small icons for "COD Available", "Fast Delivery", "Loyalty Rewards" in footer or checkout
- Empty states: Friendly illustrations (not photos) for "No orders yet", "Cart empty"
- About section: Team photo or store front (if homepage includes company info)