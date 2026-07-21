# Maquam Holidays Pvt Ltd Travel Booking Platform Requirements Document

## 1. Platform Overview

### 1.1 Platform Name
Maquam Holidays Pvt Ltd

### 1.2 Platform Description
A comprehensive Islamic-friendly travel booking platform specializing in Hajj and Umrah pilgrimage packages to Makkah and Madinah, integrating hotel, flight, and package bookings with AI-powered custom package generation.

### 1.3 Core Objectives
- Provide one-stop-shop for booking hotels, flights, and curated travel packages tailored to Islamic principles
- Specialize in pilgrimage journeys (Hajj and Umrah) to Makkah and Madinah
- Integrate AI-powered package suggestion engine using self-developed search logic
\n## 2. User Authentication & Role-Based Access Control

### 2.1 Login System
- Unified login page for all user types\n- Secure authentication with email and password
- Role-based automatic dashboard redirection upon successful login
\n### 2.2 User Roles
The platform supports four distinct user roles:
\n#### 2.2.1 Admin\n- Full system access and control
- Upon login, redirects to Admin Dashboard
- Permissions: Manage all users, flights, hotels, packages, bookings, payments, content, and system settings

#### 2.2.2 Customer
- Standard platform user for booking services
- Upon login, redirects to Customer Dashboard\n- Permissions: Search and book flights/hotels/packages, manage own bookings, view payment history, access educational resources

#### 2.2.3 Hotelier
- Hotel partner account for managing property listings
- Upon login, redirects to Hotelier Dashboard
- Permissions: Manage own hotel listings, update room inventory and pricing, view bookings for own properties, respond to reviews

#### 2.2.4 Staff
- Internal team member with limited administrative access
- Upon login, redirects to Staff Dashboard
- Permissions: View and manage bookings, assist customers, process modifications and cancellations, access customer support tools (customizable based on staff responsibilities)

### 2.3 Dashboard Routing Logic
- System detects user role upon successful authentication
- Automatic redirection based on role:\n  - Admin → Admin Dashboard
  - Customer → Customer Dashboard
  - Hotelier → Hotelier Dashboard
  - Staff → Staff Dashboard
- No manual dashboard selection required

## 3. Key Functional Modules

### 3.1 Standard Booking Engine
\n#### 3.1.1 Flight Search & Booking
- Search flights by destination, dates, and passenger count
- Trip type selection: Single trip or Round trip
- Date range selection for flexible travel dates
- Filter options for direct flights, airlines, and price ranges
- Real-time availability and pricing\n- Booking confirmation and e-ticket generation
- All prices displayed in INR (Indian Rupees)

#### 3.1.2 Hotel Search & Booking
- Search hotels by location, dates, and guest count
- Date range selection for flexible check-in/check-out dates
- Filter options:\n  - Proximity to Haram (Makkah)\n  - Proximity to Masjid an-Nabawi (Madinah)
  - Islamic-friendly amenities (prayer facilities, halal food, gender-segregated facilities)
  - Star rating and price range
- Hotel details with images, amenities, and guest reviews
- Booking confirmation with voucher\n- All prices displayed in INR (Indian Rupees)

### 3.2 Package Booking System

#### 3.2.1 Pre-designed Packages
- Hajj packages (varying durations aligned with Islamic calendar)
- Umrah packages (flexible durations)
- Trip type selection: Single trip or Round trip options where applicable
- Date range selection for flexible travel dates
- Service levels:\n  - Economy: Budget-friendly options with essential services
  - Standard: Comfortable accommodations with moderate proximity to holy sites
  - Premium: Luxury hotels near Haram/Masjid an-Nabawi with premium services
- All prices displayed in INR (Indian Rupees)

#### 3.2.2 Package Components
- Round-trip flights\n- Hotel accommodations
- Visa assistance
- Ground transportation
- Guided ziyarat (religious site visits)
- Meals (halal)\n\n### 3.3 AI-Powered Custom Package Generator

#### 3.3.1 User Input Interface
Prompt-based or form-based input accepting:
- Budget range (in INR)
- Trip type: Single trip or Round trip
- Travel dates/duration with date range selection (with Islamic calendar integration)
- Number of travelers
- Desired accommodation proximity to holy sites
- Preferred service level (direct flights, group tours, private guides)
- Specific requests (wheelchair access, dietary needs, family rooms)\n
#### 3.3.2 AI Processing Logic
- Self-developed internal search algorithm
- Analyzes user requirements against available inventory
- Matches flights, hotels, and services based on preferences and budget
- Generates optimized package combinations
- All calculations and pricing in INR (Indian Rupees)

#### 3.3.3 AI Output
For each user prompt, generate4-5 distinct package suggestions, each including:
- Total price breakdown in INR (flights, hotels, services, taxes)
- Detailed day-by-day itinerary\n- Flight details (airline, departure/arrival times, layovers, trip type)
- Hotel details (name, category, distance from Haram/Masjid an-Nabawi)
- Included services (visa processing, airport transfers, guided tours, meals)
- Comparison highlights (e.g., 'Best Value', 'Closest to Haram', 'Most Flexible')

## 4. Dashboard Systems

### 4.1 Admin Dashboard
- Centralized control panel for complete platform management
- Overview statistics (total bookings, revenue, active users, system health)
- Quick access to all management modules
- Activity logs and system notifications
- Full CRUD operations for users, flights, hotels, packages, and content

### 4.2 Customer Dashboard
- Personal booking management interface
- View upcoming and past bookings
- Booking modifications and cancellations
- Payment history and invoices
- Document upload and storage (passport copies, photos)
- Profile management\n- Access to educational resources and guides

### 4.3 Hotelier Dashboard
\n#### 4.3.1 Dashboard Overview
- Hotel property management interface
- Real-time status dashboard showing:
  - Total bookings for current day/week/month
  - Occupancy rate\n  - List of upcoming check-ins and check-outs
  - Quick links to view and manage active bookings
- Performance analytics for own hotels
\n#### 4.3.2 Property Listing & Registration Section
\n**Basic Information Management:**
- Hotel/Property Name input field
- Full Address with integrated map for location verification
- Contact Information fields (Phone, Email)\n- Hotel Category/Star Rating selector (1-5 stars)
- Brief Description & Tagline text area
\n**Detailed Amenities & Features:**
- Categorized checkboxes or toggle switches for amenities:\n  - Connectivity: Wi-Fi, Business Center\n  - Recreation: Swimming Pool, Spa, Gym, Garden
  - Services: Airport Shuttle, Room Service, Laundry, Concierge
  - Facilities: Air Conditioning, Heating, Parking, Elevator
  - Dining: Restaurant, Halal Food, Breakfast Included
  - Islamic Amenities: Prayer Room, Qibla Direction, Gender-Segregated Facilities
  - Other: Pet-Friendly, Wheelchair Accessible, Family Rooms

**Media Upload Interface:**
- Multiple photo upload functionality with drag-and-drop support
- Image preview gallery with reordering capability
- Featured image selection option
- Video upload or virtual tour link integration
- Supported formats: JPG, PNG, MP4\n- Maximum file size indicators

**Room Type Configuration:**
- Add/Edit/Remove room type interface
- For each room type, input fields for:
  - Room Name (e.g., Standard Queen, Deluxe King, Suite)
  - Maximum Occupancy (number selector)
  - Bed Configuration (dropdown: Single, Double, Queen, King, Twin)
  - Room-specific Amenities checkboxes (Ocean View, Balcony, Kitchenette, etc.)
  - Quantity Available (number of rooms of this type)
- Save and duplicate room type functionality

#### 4.3.3 Booking & Availability Management Section

**Availability Calendar:**
- Visual calendar interface for each room type
- Color-coded date indicators:\n  - Available (green)
  - Booked (red)
  - Blocked by hotelier (gray)
- Click-to-block or open dates functionality
- Bulk date selection for blocking/opening multiple dates
- Availability rules configuration:\n  - Minimum stay requirements
  - Advance booking notice period
  - Maximum stay limits
\n**Pricing Management:**
- Base price per night input for each room type (in INR)
- Seasonal pricing configuration:\n  - Date range selector
  - Custom price for selected period
- Weekly/Monthly rate options
- Special offers and discount setup:\n  - Discount percentage or fixed amount
  - Validity period
  - Promotional code generation
- Price preview calculator

**Real-Time Status Dashboard:**
- Overview widgets displaying:
  - Total bookings today/this week/this month
  - Current occupancy rate percentage
  - Revenue summary (in INR)
- Upcoming check-ins list with:\n  - Guest name\n  - Room type
  - Check-in date and time
  - Booking reference number
- Upcoming check-outs list with similar details
- Quick action buttons:\n  - View booking details
  - Modify booking
  - Contact guest
\n#### 4.3.4 Review Management\n- View customer reviews for own properties
- Respond to reviews interface
- Review rating overview
\n#### 4.3.5 Technical & Usability Features
- Intuitive interface with minimal training required
- Clear confirmation messages for all actions (save, update, delete)
- Auto-save functionality for form data to prevent information loss
- Fully responsive design for desktop, tablet, and mobile access
- Step-by-step wizard for first-time property listing
- Inline help tooltips and guidance
- Data validation with error highlighting
-Undo/Redo functionality for critical changes

### 4.4 Staff Dashboard\n- Customer support and booking management interface
- View and search all customer bookings
- Process booking modifications and cancellations
- Assist customers with inquiries
- Access customer information (with appropriate permissions)
- Generate reports for assigned tasks
- Communication tools for customer support

## 5. Administrator Management System

### 5.1 User Management
- View all registered users with search and filter capabilities
- Add new users manually with role assignment (Admin, Customer, Hotelier, Staff)
- Edit user information (name, contact details, preferences, role)
- Remove or deactivate user accounts
- View user booking history and activity
- Manage user roles and permissions

### 5.2 Flight Management
- Add new flight options (airline, route, schedule, pricing in INR)
- Edit existing flight details (timings, prices, availability)
- Remove or deactivate flight listings
- Manage flight inventory and seat availability
- Set seasonal pricing and special offers

### 5.3 Hotel Management
- Add new hotel listings (name, location, amenities, proximity to holy sites)
- Edit hotel information (room types, pricing in INR, images, descriptions)
- Remove or deactivate hotel listings
- Manage room inventory and availability
- Update hotel ratings and reviews moderation
- Assign hotels to hotelier accounts
- Approve or reject hotelier property submissions

### 5.4 Package Management
- Create new travel packages (Hajj, Umrah, custom)\n- Edit existing package details (itinerary, pricing in INR, inclusions)
- Remove or archive packages
- Manage package categories and service levels (Economy, Standard, Premium)
- Set package availability and booking limits
\n### 5.5 Resource & Content Management
- Add, edit, or remove educational guides (Hajj/Umrah procedures)\n- Manage blog posts and articles
- Update FAQ section
- Edit visa information and documentation requirements
- Manage travel tips and packing lists
\n### 5.6 Contact Information Management
- Update company contact details (phone, email, WhatsApp)
- Manage emergency contact numbers
- Edit office addresses and business hours
- Configure live chat settings
\n### 5.7 Booking Management
- View all bookings with advanced filtering\n- Edit booking details and modifications
- Process cancellations and refunds
- Manage booking status (confirmed, pending, cancelled)
- Generate booking reports

### 5.8 Payment Management
- View all transactions and payment history
- Process refunds and adjustments
- Manage Razorpay payment gateway settings
- Generate financial reports
- Monitor payment success/failure rates

### 5.9 AI Package Generator Settings
- Configure AI algorithm parameters
- Manage inventory database for AI matching
- Adjust pricing rules and optimization criteria
- Monitor AI-generated package performance

### 5.10 System Settings\n- Manage website content and pages
- Configure email templates and notifications
- Set currency and language preferences
- Manage security settings and access controls
- System backup and maintenance tools
- Role and permission configuration

## 6. Hotelier Registration System

### 6.1 Core Registration Flow & User Experience

#### 6.1.1 Multi-Step Registration Process
- Step-by-step registration wizard with clear progress indicators (e.g., Step 1 of 6)
- Visual progress bar showing completion percentage
- Ability to save draft and resume registration later via secure link sent to email
- Each step focuses on a specific category of information to avoid overwhelming users
- Navigation buttons:'Save & Continue', 'Back', 'Save Draft', 'Skip (if optional)'

#### 6.1.2 Real-Time Validation
- Instant validation for:\n  - Email format and uniqueness check
  - Phone number format with country code selector
  - Property website URL format validation
  - Tax ID/VAT number format verification
  - Password strength indicator
- Inline error messages with clear guidance on how to correct issues
- Green checkmarks for successfully validated fields
\n#### 6.1.3 Responsive & Accessible Design
- Fully responsive layout optimized for desktop, tablet, and mobile devices
- Touch-friendly form elements with adequate spacing
- Keyboard navigation support for all form fields
- Screen reader compatibility with proper ARIA labels
- Auto-focus on first field of each step
- Mobile-optimized file upload interface

#### 6.1.4 User Guidance & Support
- Contextual help tooltips next to complex fields
- Example text placeholders in input fields
- Inline suggestions for common entries
- Live chat support widget accessible throughout registration
- FAQ link specific to registration process

### 6.2 Registration Steps & Data Collection

#### Step 1: Hotelier/Management Company Details
\n**Primary Contact Information:**
- Primary Contact Person Full Name (required)
- Job Title/Position (required)
- Contact Email Address (required, with verification)
- Contact Phone Number (required, with country code selector and SMS verification option)
\n**Company Information:**
- Company Legal Name (required)
- Trading Name/DBA (if different from legal name)
- Official Business Address (required):\n  - Street Address
  - City
  - State/Province
  - Postal/ZIP Code
  - Country (dropdown selector)
- Company Phone Number (required)\n- Company Email Address (required)\n- Company Website URL (optional)\n- Tax ID/VAT Number (required for invoicing and legal compliance)
- Business Registration Number (required)\n
**Additional Contact:**
- Secondary Contact Person (optional)
- Secondary Contact Email and Phone (optional)
\n#### Step 2: Property Basics

**Property Identification:**
- Property Name (required)
- Property Type (required, dropdown):
  - Hotel
  - Resort
  - Bed & Breakfast
  - Apartment/Serviced Apartment
  - Villa
  - Guesthouse
  - Hostel
  - Other (with text input)
- Official Star Rating or Category (required,1-5 stars or'Unrated')
- Year Established (optional)
- Total Number of Rooms/Units (required)
\n**Property Location:**
- Physical Address (required):
  - Street Address
  - City
  - State/Province
  - Postal/ZIP Code
  - Country\n- Integrated Map Picker:\n  - Interactive map interface for precise location marking
  - Auto-populate coordinates (latitude/longitude)
  - Address verification against map location
  - Option to manually adjust pin placement
- Proximity to Key Landmarks (for Islamic travel focus):
  - Distance to Haram (if in Makkah)
  - Distance to Masjid an-Nabawi (if in Madinah)
  - Distance to nearest airport\n  - Distance to city center

#### Step 3: Detailed Description & Branding

**Property Description:**
- Compelling Property Description (required, rich text editor, 500-2000 characters):
  - Overview of property\n  - Unique selling points
  - Target guest demographic
  - Special features or services
- Property Tagline/Slogan (optional, max 100 characters)
- Languages Spoken by Staff (multi-select checkboxes)
\n**Visual Branding:**
- Property Logo Upload (required):
  - Accepted formats: JPG, PNG, SVG\n  - Recommended dimensions: 500x500px minimum
  - Maximum file size: 2MB
  - Preview before upload
- Cover Photo Upload (required):
  - Accepted formats: JPG, PNG\n  - Recommended dimensions: 1920x1080px
  - Maximum file size: 5MB
  - Preview with crop/resize tool
\n**Property Image Gallery:**
- Multiple Image Upload Interface:
  - Drag-and-drop functionality
  - Bulk upload support (up to 20 images)
  - Accepted formats: JPG, PNG\n  - Recommended dimensions: 1920x1080px or higher
  - Maximum file size per image: 5MB
- Image Management:
  - Thumbnail preview grid
  - Drag-to-reorder images
  - Set featured/primary image
  - Add captions to each image (optional)
  - Delete individual images
- Image Quality Requirements Display:
  - Minimum resolution guidelines
  - Lighting and composition tips
  - Examples of good vs. poor quality images

**Virtual Tour (Optional):**
- Upload 360° Virtual Tour Video (MP4, max 50MB)
- Or provide Virtual Tour Link (e.g., Matterport, Google Street View)
\n**Key Amenities & Selling Points:**
- Multi-select checkboxes organized by category:\n  - **Connectivity:** Free Wi-Fi, Business Center, Meeting Rooms
  - **Recreation:** Swimming Pool, Spa, Fitness Center, Garden, Kids Play Area
  - **Services:**24-Hour Front Desk, Room Service, Laundry Service, Concierge, Airport Shuttle
  - **Facilities:** Air Conditioning, Heating, Parking (Free/Paid), Elevator, Wheelchair Accessible
  - **Dining:** On-site Restaurant, Halal Food, Breakfast Included, Room Service, Bar/Lounge
  - **Islamic Amenities:** Prayer Room/Musalla, Qibla Direction in Rooms, Gender-Segregated Facilities, Halal-Certified Kitchen
  - **Family-Friendly:** Family Rooms, Cribs Available, Babysitting Service\n  - **Pet Policy:** Pet-Friendly, Pet Fee\n  - **Other:** Non-Smoking Rooms, Smoking Areas, Safe Deposit Box, Luggage Storage
-'Other Amenities' text field for unlisted features

#### Step 4: Room Type & Rate Configuration Setup

**Room Type Definition Interface:**
- 'Add New Room Type' button to create multiple room categories
- For each room type, collect:
\n**Room Type Details:**
- Room Type Name (required, e.g., 'Standard Double', 'Deluxe Suite', 'Family Room')
- Room Description (optional, 200-500 characters)
- Maximum Occupancy (required, number selector):\n  - Adults (required)
  - Children (optional)
  - Infants (optional)
- Bed Configuration (required, dropdown or multi-select):
  - 1 Single Bed
  - 1 Double Bed
  - 1 Queen Bed
  - 1 King Bed
  - 2 Single Beds
  - 2 Double Beds
  - Custom configuration (text input)
- Room Size (optional, in square meters or square feet)
- Number of Rooms Available (required, for this room type)
\n**Room-Specific Amenities:**
- Checkboxes for room-level features:
  - Private Bathroom/En-suite
  - Bathtub/Shower
  - Flat-screen TV
  - Mini-fridge
  - Coffee/Tea Maker
  - Safe
  - Balcony/Terrace
  - City View/Sea View/Garden View
  - Kitchenette
  - Separate Living Area
  - Work Desk
  - Sofa Bed
  - Soundproofing
  - Qibla Direction Indicator
\n**Room Photos:**
- Upload multiple photos specific to this room type (up to 10images)
- Drag-and-drop interface with preview
- Set primary room image
\n**Initial Rate Setup:**
- Base Rate per Night (required, in INR)
- Rate Type (required, dropdown):
  - Per Room
  - Per Person
- Breakfast Inclusion (dropdown):
  - Not Included
  - Included in Rate
  - Available for Additional Fee
- Refundable/Non-Refundable Rate Options\n- Availability Setup for Rolling365-Day Period:\n  - Quick calendar view for next 12 months
  - Bulk availability setting (e.g., 'Available all days' or 'Block specific dates')
  - Note: Full calendar and dynamic rate management available post-registration in dashboard

**Room Type Management:**
- 'Save Room Type' button\n- 'Duplicate Room Type' for similar configurations
- 'Delete Room Type' with confirmation
- Summary list of all added room types with edit/delete options

#### Step 5: Policy & Contract Management

**Booking Policies:**
\n*Cancellation Policy (required):*
- Policy Type (dropdown):
  - Flexible: Free cancellation until X days before check-in
  - Moderate: Partial refund if cancelled X days before check-in
  - Strict: No refund after booking
  - Custom (define below)
- If Flexible or Moderate:\n  - Free Cancellation Period (number input, days before check-in)
  - Cancellation Fee Structure:\n    - Percentage of total booking amount (slider or input)
    - Or fixed fee amount (in INR)
  - No-show Policy (percentage charge or full charge)
\n*Check-in/Check-out Times (required):*
- Standard Check-in Time (time picker, e.g., 2:00 PM)
- Standard Check-out Time (time picker, e.g., 11:00 AM)
- Early Check-in Available (checkbox, with additional fee option)
- Late Check-out Available (checkbox, with additional fee option)\n\n*Guest Policies (required):*
- Children Policy (dropdown):
  - Children of all ages welcome
  - Children above X years welcome
  - Adults only\n- Children Pricing:\n  - Free up to X years
  - Charged as adults from X years
- Extra Bed/Crib Availability (checkbox)
- Extra Bed/Crib Fee (in INR, if applicable)
- Pet Policy (dropdown):
  - Pets not allowed
  - Pets allowed (with fee)
  - Pets allowed (free)
- Pet Fee (in INR, if applicable)\n- Smoking Policy (dropdown):
  - Non-smoking property
  - Designated smoking areas only
  - Smoking allowed in rooms
\n*Additional Policies (optional):*
- Age Restriction (minimum age for check-in)
- Group Booking Policy\n- Special Requirements or House Rules (text area)
\n**Payment Terms:**
\n*Payout Method (required):*
- Bank Transfer (default)
  - Bank Name (required)
  - Account Holder Name (required)
  - Account Number (required)
  - IFSC Code/SWIFT Code (required)
  - Branch Address (optional)
- PayPal (email address required)
- Other (specify and provide details)

*Payout Schedule (required, dropdown):*
- Weekly
- Bi-weekly
- Monthly\n- After guest check-out (with X days processing time)

*Commission Structure Information:*
- Display platform commission rate (e.g., 'Platform charges15% commission on each booking')
- Explanation of how payouts are calculated
- Link to detailed commission terms

**Legal Agreement & Terms of Service:**

*Partnership Agreement Presentation:*
- Full-text display of Terms & Conditions in scrollable box
- Key highlights section summarizing:\n  - Commission rates
  - Payment terms
  - Cancellation and refund responsibilities
  - Data usage and privacy
  - Liability and insurance
  - Termination clauses
-'Download PDF' option for offline review

*Acceptance (required):*
- Checkbox:'I have read and agree to the Terms of Service and Partnership Agreement'
- Checkbox: 'I confirm that I have the authority to bind the company/property to this agreement'
- Digital Signature Field (typed name or e-signature)
- Date of Acceptance (auto-populated)

#### Step 6: Account Verification & Security

**Email Verification:**
- Automated verification email sent to registered email address
- Email contains unique verification link
- User must click link to verify email before proceeding
- Resend verification email option if not received
- Verification status indicator on registration page

**Mobile Phone Verification (Optional but Recommended):**
- SMS verification code sent to registered phone number\n- User enters6-digit code to verify\n- Resend code option\n- Verification status indicator\n
**Identity & Business Document Upload:**
\n*Purpose:* Fraud prevention and account validation
\n*Required Documents (at least one):*
- Government-issued ID of Primary Contact (Passport, National ID, Driver's License)
- Business Registration Certificate
- Tax Registration Document\n- Property Ownership Proof or Lease Agreement
\n*Upload Interface:*
- Drag-and-drop or browse to upload\n- Accepted formats: PDF, JPG, PNG\n- Maximum file size: 10MB per document
- Multiple document upload support
- Document type selector for each upload
- Preview uploaded documents\n- Note: 'Documents will be reviewed by our team within 24-48 hours'

**Password & Security Setup:**

*Password Creation (required):*
- Password input field with show/hide toggle
- Confirm password field
- Real-time password strength indicator:\n  - Weak (red)
  - Medium (yellow)
  - Strong (green)
- Password requirements display:\n  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
\n*Two-Factor Authentication (2FA) Setup (Optional but Recommended):*
- Checkbox: 'Enable Two-Factor Authentication for added security'
- If enabled:\n  - Choose2FA method (SMS or Authenticator App)
  - Setup instructions and QR code (for authenticator app)
  - Verify2FA code before completion
\n**Security Questions (Optional):**
- Select and answer 2-3 security questions for account recovery
- Dropdown list of predefined questions
- Text input for answers
\n### 6.3 Post-Registration Onboarding & Dashboard Access

#### 6.3.1 Registration Completion Confirmation

**Success Message:**
- Congratulatory message: 'Thank you for registering with Maquam Holidays! Your property listing is under review.'
- Summary of submitted information
- Estimated review timeline: 'Our team will review your submission within 24-48 hours'\n- Confirmation email sent to registered email address

**Next Steps Guidance:**
- 'What happens next?' section:\n  - Document verification in progress
  - Property listing review by admin team
  - Approval notification via email
  - Access to partner dashboard upon approval

#### 6.3.2 Redirect to Secure Partner Dashboard

**Upon Approval:**
- Email notification: 'Your property has been approved!'
- Login credentials reminder
- Direct link to Hotelier Dashboard
\n**Dashboard First-Time Access:**
- Welcome banner with personalized greeting
- Quick tour/walkthrough of dashboard features (optional, can be skipped)
- Dashboard overview with key metrics (initially zero/empty)
\n#### 6.3.3 Onboarding Checklist
\n**Interactive Checklist Widget:**
Displayed prominently on dashboard homepage until all tasks completed:\n\n1. ✅ Complete Property Registration (auto-checked)
2. ⬜ Complete Your Availability Calendar\n   - Link to calendar management page
   - Tooltip: 'Set your room availability for the next 12 months'
3. ⬜ Set Up Dynamic Pricing & Rates
   - Link to rate management page
   - Tooltip: 'Configure seasonal rates and special offers'
4. ⬜ Upload Additional Property Photos
   - Link to media gallery
   - Tooltip: 'Add more high-quality images to attract guests'
5. ⬜ Create Your First Promotion
   - Link to promotional tools\n   - Tooltip: 'Offer discounts to boost bookings'
6. ⬜ Set Up Guest Communication Preferences
   - Link to communication settings
   - Tooltip: 'Configure how you receive booking notifications'
7. ⬜ Review and Update Policies
   - Link to policy management
   - Tooltip: 'Ensure all policies are accurate and up-to-date'
\n**Progress Indicator:**
- Visual progress bar showing percentage of checklist completion
- Motivational message: 'You're 30% done! Complete your profile to start receiving bookings.'
\n#### 6.3.4 Partner Dashboard Features (Post-Registration Access)

**Dashboard Homepage:**
- Welcome message with property name
- Key performance metrics:\n  - Total bookings (today/week/month)
  - Occupancy rate
  - Revenue summary (in INR)
  - Average rating
- Quick action buttons:
  - View Bookings
  - Manage Calendar
  - Update Rates
  - Respond to Reviews
- Recent activity feed
- Notifications center

**Calendar & Availability Management:**
- Visual calendar interface for all room types
- Color-coded availability status\n- Drag-to-select date ranges for bulk updates
- Availability rules configuration
- Sync with external calendars (iCal integration)

**Rate & Inventory Management:**
- Base rate management for each room type
- Seasonal pricing setup with date range selector
- Dynamic pricing tools (demand-based suggestions)
- Discount and promotion creation:\n  - Early bird discounts
  - Last-minute deals
  - Long-stay discounts
  - Promotional codes
- Rate comparison with competitor properties (optional feature)

**Booking Overview & Details:**
- Comprehensive booking list with filters:\n  - By date range
  - By booking status (confirmed, pending, cancelled)
  - By room type
  - By guest name
- Detailed booking view:\n  - Guest information
  - Room details
  - Check-in/check-out dates
  - Payment status
  - Special requests
- Booking modification tools\n- Cancellation processing
- Export bookings to CSV/Excel

**Performance Analytics & Reports:**
- Visual charts and graphs:\n  - Booking trends over time
  - Occupancy rate trends
  - Revenue breakdown by room type
  - Average daily rate (ADR)
  - Revenue per available room (RevPAR)
- Customizable date range for reports
- Comparison with previous periods
- Export reports to PDF/Excel

**Promotional Tools & Marketing Materials:**
- Create and manage special offers\n- Featured listing upgrade options
- Social media sharing tools
- Email marketing templates for past guests
- Referral program participation

**Guest Communication Inbox:**
- Centralized messaging system for guest inquiries
- Pre-arrival messages and check-in instructions
- Post-stay thank you messages and review requests
- Automated message templates
- Real-time notifications for new messages
- Message history and search\n
**Review & Rating Management:**
- View all guest reviews and ratings
- Respond to reviews (public responses)\n- Flag inappropriate reviews for admin review
- Review performance summary (average rating, total reviews)
- Review response templates
\n**Invoice & Payment History:**
- List of all payouts received
- Detailed invoice breakdown:\n  - Booking revenue
  - Platform commission
  - Taxes\n  - Net payout\n- Payment status tracking
- Download invoices (PDF)\n- Tax documentation for accounting

**Property Management:**
- Edit property information
- Update room types and rates
- Manage amenities and facilities
- Upload/remove photos and videos
- Update policies\n- Temporarily disable property listing

**Account Settings:**
- Update contact information
- Change password
- Manage 2FA settings
- Notification preferences
- Language and timezone settings
- Payout method updates

**Help & Support:**
- Knowledge base and FAQs
- Video tutorials
- Live chat support
- Submit support ticket
- Contact account manager (for premium partners)

### 6.4 Technical Specifications for Hotelier Registration System

#### 6.4.1 Frontend Technologies
- Responsive HTML5/CSS3 framework
- JavaScript framework (React.js or Vue.js) for dynamic form handling
- AJAX for real-time validation without page reload
- Drag-and-drop file upload library (e.g., Dropzone.js)
- Interactive map integration (Google Maps API or Mapbox)
- Rich text editor for descriptions (e.g., TinyMCE, Quill)
- Date picker and time picker components
- Image cropping and preview tools
\n#### 6.4.2 Backend Technologies
- RESTful API architecture for form submission and data retrieval
- Server-side validation to complement frontend validation
- Secure file upload handling with virus scanning
- Image optimization and compression on upload
- Email service integration for verification and notifications (e.g., SendGrid, AWS SES)
- SMS gateway integration for phone verification (e.g., Twilio)\n- Session management for draft saving and resume functionality
- Database transactions to ensure data integrity

#### 6.4.3 Database Schema (Key Tables & Fields)

**hoteliers table:**
- hotelier_id (Primary Key, UUID)
- primary_contact_name\n- primary_contact_title
- primary_contact_email (unique, indexed)
- primary_contact_phone\n- company_legal_name
- company_trading_name
- company_address (JSON: street, city, state, postal_code, country)
- company_phone
- company_email
- company_website
- tax_id\n- business_registration_number
- secondary_contact_name
- secondary_contact_email
- secondary_contact_phone
- registration_status (enum: draft, pending_verification, approved, rejected)
- created_at (timestamp)
- updated_at (timestamp)
- email_verified (boolean)
- phone_verified (boolean)
- password_hash\n- two_factor_enabled (boolean)
- two_factor_secret
\n**properties table:**
- property_id (Primary Key, UUID)
- hotelier_id (Foreign Key → hoteliers.hotelier_id)
- property_name
- property_type (enum: hotel, resort, bnb, apartment, villa, guesthouse, hostel, other)
- star_rating (integer,1-5 or null)
- year_established
- total_rooms
- physical_address (JSON: street, city, state, postal_code, country)
- latitude (decimal)
- longitude (decimal)\n- distance_to_haram (decimal, nullable)
- distance_to_masjid_nabawi (decimal, nullable)
- distance_to_airport (decimal, nullable)
- distance_to_city_center (decimal, nullable)
- description (text)
- tagline (varchar)\n- languages_spoken (JSON array)
- logo_url\n- cover_photo_url\n- virtual_tour_url
- amenities (JSON array)
- approval_status (enum: pending, approved, rejected)
- created_at (timestamp)
- updated_at (timestamp)
\n**property_images table:**
- image_id (Primary Key, UUID)\n- property_id (Foreign Key → properties.property_id)
- image_url\n- caption (text, nullable)
- display_order (integer)\n- is_featured (boolean)
- uploaded_at (timestamp)
\n**room_types table:**
- room_type_id (Primary Key, UUID)
- property_id (Foreign Key → properties.property_id)
- room_name
- room_description (text)
- max_occupancy_adults (integer)
- max_occupancy_children (integer, nullable)
- max_occupancy_infants (integer, nullable)
- bed_configuration (varchar)
- room_size (decimal, nullable)
- room_size_unit (enum: sqm, sqft)\n- quantity_available (integer)
- amenities (JSON array)
- base_rate_per_night (decimal)
- rate_type (enum: per_room, per_person)\n- breakfast_inclusion (enum: not_included, included, additional_fee)
- created_at (timestamp)
- updated_at (timestamp)

**room_images table:**
- image_id (Primary Key, UUID)
- room_type_id (Foreign Key → room_types.room_type_id)
- image_url
- display_order (integer)
- is_primary (boolean)
- uploaded_at (timestamp)

**booking_policies table:**
- policy_id (Primary Key, UUID)
- property_id (Foreign Key → properties.property_id)
- cancellation_policy_type (enum: flexible, moderate, strict, custom)
- free_cancellation_days (integer, nullable)
- cancellation_fee_percentage (decimal, nullable)
- cancellation_fee_fixed (decimal, nullable)
- no_show_policy (varchar)
- check_in_time (time)
- check_out_time (time)
- early_checkin_available (boolean)
- early_checkin_fee (decimal, nullable)\n- late_checkout_available (boolean)
- late_checkout_fee (decimal, nullable)
- children_policy (varchar)
- children_free_age (integer, nullable)
- extra_bed_available (boolean)
- extra_bed_fee (decimal, nullable)
- crib_available (boolean)
- crib_fee (decimal, nullable)
- pet_policy (enum: not_allowed, allowed_with_fee, allowed_free)
- pet_fee (decimal, nullable)
- smoking_policy (enum: non_smoking, designated_areas, allowed_in_rooms)
- minimum_age_checkin (integer, nullable)
- additional_policies (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**payment_details table:**
- payment_detail_id (Primary Key, UUID)\n- hotelier_id (Foreign Key → hoteliers.hotelier_id)\n- payout_method (enum: bank_transfer, paypal, other)
- bank_name (varchar, nullable)
- account_holder_name (varchar, nullable)
- account_number (varchar, nullable)
- ifsc_swift_code (varchar, nullable)
- branch_address (varchar, nullable)
- paypal_email (varchar, nullable)
- other_method_details (text, nullable)
- payout_schedule (enum: weekly, biweekly, monthly, post_checkout)
- created_at (timestamp)
- updated_at (timestamp)

**verification_documents table:**
- document_id (Primary Key, UUID)
- hotelier_id (Foreign Key → hoteliers.hotelier_id)
- document_type (enum: government_id, business_registration, tax_document, property_ownership)
- document_url
- verification_status (enum: pending, approved, rejected)
- uploaded_at (timestamp)
- reviewed_at (timestamp, nullable)
- reviewed_by (Foreign Key → admin_users, nullable)
\n**legal_agreements table:**
- agreement_id (Primary Key, UUID)
- hotelier_id (Foreign Key → hoteliers.hotelier_id)
- agreement_version (varchar)
- accepted_at (timestamp)
- digital_signature (varchar)
- ip_address (varchar)
\n#### 6.4.4 API Endpoints

**Registration Flow:**
- POST /api/hotelier/register/step1 - Submit Step 1 data
- POST /api/hotelier/register/step2 - Submit Step 2 data
- POST /api/hotelier/register/step3 - Submit Step 3 data
- POST /api/hotelier/register/step4 - Submit Step 4 data
- POST /api/hotelier/register/step5 - Submit Step 5 data
- POST /api/hotelier/register/step6 - Submit Step 6 data
- POST /api/hotelier/register/save-draft - Save draft at any step
- GET /api/hotelier/register/resume/{token} - Resume saved draft
\n**Validation:**
- POST /api/hotelier/validate/email - Check email uniqueness
- POST /api/hotelier/validate/phone - Validate phone format
- POST /api/hotelier/validate/tax-id - Validate tax ID format
\n**Verification:**
- POST /api/hotelier/verify/email - Send verification email
- GET /api/hotelier/verify/email/{token} - Verify email via link
- POST /api/hotelier/verify/phone - Send SMS verification code
- POST /api/hotelier/verify/phone/confirm - Confirm SMS code

**File Upload:**
- POST /api/hotelier/upload/logo - Upload property logo
- POST /api/hotelier/upload/cover-photo - Upload cover photo
- POST /api/hotelier/upload/property-images - Upload property gallery images
- POST /api/hotelier/upload/room-images - Upload room type images
- POST /api/hotelier/upload/documents - Upload verification documents

**Map Integration:**
- GET /api/geocode/address - Convert address to coordinates
- GET /api/geocode/reverse - Convert coordinates to address
\n#### 6.4.5 Security Measures
- HTTPS/SSL encryption for all data transmission
- CSRF token validation for all form submissions
- Rate limiting on API endpoints to prevent abuse
- Input sanitization to prevent SQL injection and XSS attacks
- Secure file upload validation (file type, size, content scanning)
- Password hashing using bcrypt or Argon2
- Two-factor authentication implementation
- Session timeout after 30 minutes of inactivity
- Audit logging of all registration and modification activities
- GDPR compliance for data storage and processing
- Regular security audits and penetration testing\n
#### 6.4.6 Performance Optimization
- Lazy loading of form steps to reduce initial page load\n- Image compression and optimization on upload
- CDN integration for serving static assets and uploaded media
- Database indexing on frequently queried fields (email, property_id, hotelier_id)
- Caching of static content and frequently accessed data
- Asynchronous processing for email/SMS sending
- Progress indicators for long-running operations (file uploads, document verification)

#### 6.4.7 User Interface Mockup Guidelines

**Step Navigation:**
- Horizontal step indicator at top of page
- Current step highlighted\n- Completed steps marked with checkmark
- Future steps grayed out
- Progress percentage displayed

**Form Layout:**
- Single-column layout for mobile\n- Two-column layout for desktop where appropriate
- Clear section headings with icons
- Grouped related fields with visual separation
- Consistent spacing and alignment
- Prominent'Save & Continue' button at bottom
-'Back' button to return to previous step
-'Save Draft' link in header

**Visual Design:**
- Clean, modern interface with ample white space
- Primary color: Deep teal (consistent with platform branding)
- Accent color: Soft gold for highlights and CTAs
- Error messages in red with icon
- Success messages in green with icon
- Tooltips with light gray background
- Responsive breakpoints for tablet and mobile

**Interactive Elements:**
- Hover effects on buttons and clickable elements
- Focus states for form inputs
- Loading spinners for asynchronous operations
- Smooth transitions between steps
- Animated checkmarks for completed validations
- Drag-and-drop visual feedback for file uploads

## 7. Essential Website Content & Sections

### 7.1 Educational Resources
- Comprehensive guides on Hajj rituals, requirements, and preparations
- Umrah step-by-step procedures\n- Visa application procedures and required documentation
- Packing lists and travel tips for pilgrims
\n### 7.2 Blog & Resource Section
- Islamic travel tips\n- Spiritual significance of holy sites
- Travel stories and testimonials
- Seasonal travel advice aligned with Islamic calendar

### 7.3 Support & Information
- FAQ section\n- Contact information (phone, email, WhatsApp)
- Live chat support
- Emergency contact numbers for travelers
\n## 8. Payment Integration\n
### 8.1 Payment Gateway\n- **Razorpay payment gateway integration**
- Supported payment methods:\n  - Credit/Debit cards (Visa, Mastercard, American Express, RuPay)
  - Net banking (all major Indian banks)
  - UPI (Google Pay, PhonePe, Paytm, BHIM)
  - Digital wallets (Paytm, Mobikwik, Freecharge)
  - EMI options (No Cost EMI and Standard EMI)
  - Cardless EMI\n  - Pay Later options
- All transactions processed in INR (Indian Rupees)
- Real-time payment status updates
\n### 8.2 Payment Features
- Secure payment processing with PCI DSS compliant Razorpay infrastructure
- SSL encryption for all payment transactions
- Booking deposit and installment payment options
- Automatic payment confirmation emails with transaction details
- Refund processing for cancellations through Razorpay dashboard
- Payment retry mechanism for failed transactions
- Multiple currency support (with INR as primary)\n- Payment link generation for offline bookings
- Webhook integration for real-time payment notifications
- Detailed payment analytics and reporting
- Fraud detection and prevention mechanisms
- All payment amounts displayed in INR

### 8.3 Razorpay Integration Technical Details
- Razorpay Checkout integration for seamless payment experience
- Payment Gateway API for backend processing
- Razorpay Dashboard access for admin payment management
- Automatic settlement to merchant bank account
- Transaction reconciliation tools
- Invoice generation with Razorpay transaction ID
- Support for subscription-based payments (for recurring packages)
- QR code payment support\n- Bharat QR integration\n\n## 9. Language Support

### 9.1 Primary Language
- English as the primary interface language
- All content, forms, and communications in English
\n## 10. Design & User Experience

### 10.1 Visual Design Style
- Color palette: Calming tones with deep teal as primary color, complemented by soft gold accents and clean white backgrounds
- Typography: Clear, readable Arabic-inspired English fonts for headings, paired with modern sans-serif for body text
- Imagery: High-quality photos of Makkah, Madinah, and pilgrims in respectful contexts
- Islamic geometric patterns as subtle decorative elements in headers and dividers
\n### 10.2 User Interface Principles
- Intuitive navigation with clear menu structure
- Prominent search and AI package generator access on homepage
- Step-by-step booking process with progress indicators
- Clear call-to-action buttons with sufficient contrast
- Minimal clutter with focus on essential information
- Role-specific dashboard layouts optimized for each user type

### 10.3 Responsive Design
- Fully responsive layout for desktop, tablet, and mobile devices
- Touch-friendly interface elements for mobile users
- Optimized loading speed across all devices
\n### 10.4 Islamic Values Integration
- Respectful imagery avoiding inappropriate content
- Prayer time indicators\n- Qibla direction feature in customer portal
- Islamic calendar integration for date selection
- Modest presentation of all visual content

### 10.5 Dashboard Interface Design
- Clean, professional dashboard layouts for all user roles
- Role-specific navigation menus and widgets
- Data tables with sorting and filtering capabilities
- Form-based interfaces for adding/editing content
- Confirmation dialogs for critical actions (delete, deactivate)
- Responsive design for dashboard access on various devices
- Visual calendar components with intuitive date selection
- Drag-and-drop functionality for media uploads
- Real-time data updates and notifications

## 11. Technical Implementation

### 11.1 AI Package Generator Architecture
- Custom-built search logic using internal coding structure
- Database of flights, hotels, and service providers
- Algorithm parameters:\n  - Budget optimization (in INR)
  - Proximity scoring to holy sites
  - Service level matching\n  - Date availability checking
  - Multi-criteria ranking system

### 11.2 User Flow for AI Package Generator
1. User accesses 'Custom Package Generator' from homepage
2. User fills prompt/form with requirements (including trip type and date range)
3. System processes input through AI search logic
4. AI queries database and applies matching algorithms
5. System generates 4-5 optimized package options with prices in INR
6. User reviews suggestions with detailed breakdowns
7. User selects preferred package\n8. System redirects to booking confirmation and payment via Razorpay
\n### 11.3 Role-Based Access Control Architecture
- Database schema includes user role field (Admin, Customer, Hotelier, Staff)
- Authentication middleware validates credentials and retrieves user role
- Dashboard routing logic:\n  - Upon successful login, system reads user role from database
  - Server-side redirect to role-specific dashboard URL
  - Frontend guards prevent unauthorized access to other dashboards
- Permission matrix defines allowed actions for each role
- Session management maintains role information throughout user session

### 11.4 Admin System Architecture
- Role-based access control for admin users
- Secure admin login with two-factor authentication
- Activity logging for all admin actions
- Database management interface for CRUD operations
- Automated backup system for data protection
\n### 11.5 Hotelier Dashboard Technical Architecture
- Real-time data synchronization for availability and bookings
- Auto-save mechanism with local storage backup
- Image optimization and CDN integration for media uploads
- Calendar API integration for availability management
- Notification system for new bookings and guest messages
- Data validation layer for pricing and availability inputs
- Responsive grid layout with mobile-first approach

## 12. Security & Compliance

### 12.1 Data Protection
- SSL certificate for secure data transmission
- Encrypted storage of customer personal information
- PCI DSS compliance for payment processing through Razorpay
- Regular security audits\n\n### 12.2 Privacy Policy
- Clear privacy policy outlining data usage\n- GDPR compliance for international users
- User consent for data collection and marketing communications
\n### 12.3 Authentication & Authorization Security
- Secure password hashing and storage
- Role-based access control enforcement at both frontend and backend
- Session timeout and automatic logout for inactive users
- Multi-level admin access permissions
- Two-factor authentication for admin and staff accounts
- IP whitelisting for admin access (optional)
- Regular security updates and patches
- Audit trails for all administrative actions
- Protection against unauthorized dashboard access attempts
- Secure file upload validation to prevent malicious content