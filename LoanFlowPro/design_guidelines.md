# Loan Management System - Design Guidelines

## Design Approach
**Selected Approach:** Design System-Based (Material Design + Financial Industry Standards)

**Justification:** As a utility-focused financial management platform with information-dense interfaces, this application prioritizes efficiency, data clarity, and professional trust over visual flair. The design leverages Material Design principles adapted for financial software, ensuring familiarity while maintaining the gravitas expected in banking applications.

**Core Design Principles:**
- Data-First Hierarchy: Financial information takes visual precedence
- Trust Through Clarity: Professional aesthetics that inspire confidence
- Efficient Workflows: Minimize clicks, maximize productivity
- Role-Appropriate Interfaces: Tailored experiences for Admin, Loan Officers, Collection Agents, and Accountants

## Color Palette

**Light Mode:**
- Primary: 220 70% 45% (Professional blue - trust and stability)
- Primary Hover: 220 70% 38%
- Secondary: 220 20% 30% (Charcoal for text and borders)
- Background: 0 0% 98% (Soft white)
- Surface: 0 0% 100% (Pure white cards)
- Success: 142 76% 36% (Green for approved/paid)
- Warning: 38 92% 50% (Amber for pending/overdue)
- Danger: 0 84% 60% (Red for rejected/defaults)
- Text Primary: 220 20% 15%
- Text Secondary: 220 15% 45%
- Border: 220 20% 88%

**Dark Mode:**
- Primary: 220 70% 55%
- Primary Hover: 220 70% 48%
- Secondary: 220 15% 75%
- Background: 220 20% 8%
- Surface: 220 18% 12%
- Success: 142 76% 42%
- Warning: 38 92% 55%
- Danger: 0 84% 65%
- Text Primary: 220 15% 92%
- Text Secondary: 220 12% 65%
- Border: 220 15% 22%

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - Clean, professional, excellent for data display
- Monospace: 'JetBrains Mono' - For financial figures, account numbers, transaction IDs

**Type Scale:**
- Hero/Dashboard Title: text-4xl font-bold (36px)
- Page Headers: text-2xl font-semibold (24px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base font-normal (16px)
- Table Headers: text-sm font-semibold uppercase tracking-wide (14px)
- Captions/Labels: text-sm font-medium (14px)
- Financial Figures: text-lg font-mono font-semibold (18px monospace)

## Layout System

**Spacing Primitives:** Use Tailwind units of 3, 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-6
- Section spacing: mb-8 to mb-12
- Card spacing: p-6 to p-8
- Form field gaps: space-y-4
- Grid gaps: gap-6

**Container Strategy:**
- Dashboard: max-w-full with px-4 md:px-6 lg:px-8
- Forms/Details: max-w-6xl mx-auto
- Modals: max-w-2xl to max-w-4xl depending on content

## Component Library

**Navigation:**
- Top Bar: Sticky header with logo, search bar, notifications, user menu
- Sidebar: Collapsible navigation with role-based menu items, icons + labels
- Breadcrumbs: Clear navigation path for nested pages

**Data Display:**
- Tables: Striped rows, hover states, sortable columns, fixed headers for long lists
- Status Badges: Pill-shaped with role-specific colors (Draft/gray, Approved/green, Overdue/red)
- Cards: Elevated surfaces with subtle shadows, rounded corners (rounded-lg)
- Stats Cards: Large numbers with trend indicators, icons, and comparison metrics

**Forms:**
- Input Fields: Clear labels, placeholder text, validation states with icons
- Select Dropdowns: Searchable for long lists (loan types, customers)
- Date Pickers: Calendar interface for EMI schedules and due dates
- File Upload: Drag-and-drop areas for KYC documents with preview
- Multi-Step Forms: Progress indicator for loan application workflow

**Actions:**
- Primary Buttons: Solid primary color, rounded-md, px-6 py-2.5
- Secondary Buttons: Outline style with hover states
- Icon Buttons: For table actions (edit, delete, view)
- Floating Action Button: For quick "Add New Loan" action

**Overlays:**
- Modals: For confirmations, quick edits, document preview
- Drawers: Side panel for detailed loan information, customer profiles
- Toasts: Success/error notifications with auto-dismiss
- Loading States: Skeleton screens for tables and cards

**Dashboard Specific:**
- Metric Cards: Grid layout (2-4 columns) showing key statistics
- Charts: Bar charts for monthly collections, line charts for loan trends (use Chart.js or Recharts)
- Quick Actions Panel: Frequently used operations for each role
- Recent Activity Feed: Timeline of recent transactions and approvals

**Financial Components:**
- EMI Calculator: Interactive calculator showing breakdowns
- Payment Receipt Preview: Formatted receipt layout before PDF generation
- Passbook View: Ledger-style transaction history with running balance
- Loan Summary Cards: Compact view of loan details with progress indicators

## Animations

Use sparingly and purposefully:
- Table row hover: Subtle background color change (no transition delay)
- Modal entry: Simple fade-in with scale (duration-200)
- Toast notifications: Slide-in from top-right
- Loading spinners: Only for data fetch operations
- NO scroll animations or parallax effects

## Images

**Hero Image:** None - This is a dashboard application, not a marketing site

**Iconography:**
- Use Heroicons (outline style) for navigation and actions
- Custom financial icons for loan types (home, car, personal, business, gold)
- Document type icons for KYC uploads (PDF, JPG, etc.)

**Profile Images:**
- Customer avatars: Circular with initials fallback
- Default placeholder: Neutral gray with user icon

This design system creates a professional, efficient, and trustworthy interface appropriate for financial management while maintaining excellent usability across all user roles.