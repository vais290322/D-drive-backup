# Settings Feature - Quick Start Guide

## 🎯 What's New?

A complete **Business Settings** page where you can configure all your company details in one place!

---

## ✨ Features Added

### 1. **Settings Page** (`/settings`)
- Configure company logo, name, tagline
- Set business address and contact details
- Add tax information (GSTIN, PAN)
- Configure bank details for payments
- Set default terms & conditions

### 2. **Automatic Branding**
- Logo and company name appear in sidebar
- All documents use your settings
- Consistent branding everywhere

### 3. **Document Components**
- `DocumentHeader` - Reusable header with logo and company info
- `DocumentFooter` - Reusable footer with terms and bank details

---

## 🚀 Quick Start

### Step 1: Access Settings

1. Login to your CRM
2. Click **"Settings"** in the sidebar (gear icon ⚙️)
3. You'll see the Business Settings page

### Step 2: Upload Logo

1. Click **"Upload Logo"** button
2. Select your company logo (PNG/JPG, max 2MB)
3. Logo appears immediately in sidebar and documents

### Step 3: Fill Company Details

1. Enter **Company Name** (required)
2. Add **Tagline** (optional)
3. Fill in **Address** details
4. Add **Contact Information**
5. Enter **Tax Details** (GSTIN, PAN)
6. Add **Bank Details**
7. Set **Terms & Conditions**
8. Click **"Save Settings"**

### Step 4: Verify

1. Check sidebar - should show your logo and company name
2. Generate any document (invoice, ledger, agreement)
3. Your settings will appear automatically!

---

## 📄 Using Settings in Documents

### Method 1: Use the Hook

```tsx
import { useBusinessSettings } from "@/hooks/use-business-settings";

export default function MyDocument() {
  const { settings, loading } = useBusinessSettings();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{settings?.company_name}</h1>
      <p>{settings?.phone}</p>
    </div>
  );
}
```

### Method 2: Use Document Components

```tsx
import { useBusinessSettings } from "@/hooks/use-business-settings";
import DocumentHeader from "@/components/documents/DocumentHeader";
import DocumentFooter from "@/components/documents/DocumentFooter";

export default function Invoice() {
  const { settings } = useBusinessSettings();

  return (
    <div className="p-8">
      {/* Header with logo and company info */}
      <DocumentHeader settings={settings} title="INVOICE" />
      
      {/* Your content */}
      <div className="my-8">
        {/* Invoice details here */}
      </div>
      
      {/* Footer with terms and bank details */}
      <DocumentFooter 
        settings={settings} 
        showTerms={true}
        showBankDetails={true}
      />
    </div>
  );
}
```

---

## 🗂️ Files Created

### Database
- `supabase/migrations/01_create_business_settings.sql` - Database schema
- Creates `business_settings` table
- Creates `business-logos` storage bucket

### API
- `src/db/settingsApi.ts` - API functions for settings
- `src/db/supabase.ts` - Supabase client (already existed)

### Types
- `src/types/types.ts` - Added `BusinessSettings` interface

### Components
- `src/pages/Settings.tsx` - Settings page
- `src/components/documents/DocumentHeader.tsx` - Reusable header
- `src/components/documents/DocumentFooter.tsx` - Reusable footer

### Hooks
- `src/hooks/use-business-settings.ts` - React hook for settings

### Routes
- Added `/settings` route to `src/routes.tsx`

### Updated
- `src/components/common/Sidebar.tsx` - Now uses business settings
- `src/routes.tsx` - Added Settings route with icon

---

## 🎨 What Appears Where?

### Sidebar
```
┌─────────────────────┐
│  [YOUR LOGO]        │
│  Your Company Name  │
│  Your Tagline       │
├─────────────────────┤
│  📊 Dashboard       │
│  ...                │
└─────────────────────┘
```

### Document Header
```
[LOGO]  Your Company Name
        Your Tagline
        Your Address
        City, State, PIN
        
Phone: +91 XXX | Email: info@...
GSTIN: XXX | PAN: XXX
```

### Document Footer
```
Bank Details for Payment
Bank: Your Bank | Account: XXX | IFSC: XXX

Terms & Conditions
[Your custom terms here]

This is a computer-generated document from Your Company Name
For queries, contact: email | phone
```

---

## 🔧 Configuration

### Environment Variables

Already configured in `.env`:
```
VITE_SUPABASE_URL=https://acbqilavnfxjfilzwnjd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Default Settings

Default values are pre-filled:
- Company Name: "Digital Dreems"
- Tagline: "Loan Management CRM"
- Country: "India"
- Default terms & conditions

You can change these in the Settings page!

---

## 📊 Database Schema

### Table: `business_settings`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| company_name | Text | Yes | Company name |
| tagline | Text | No | Company tagline |
| logo_url | Text | No | Logo URL |
| address_line1 | Text | No | Address line 1 |
| address_line2 | Text | No | Address line 2 |
| city | Text | No | City |
| state | Text | No | State |
| pincode | Text | No | PIN code |
| country | Text | No | Country |
| phone | Text | No | Primary phone |
| alternate_phone | Text | No | Secondary phone |
| email | Text | No | Email |
| website | Text | No | Website |
| gstin | Text | No | GST number |
| pan | Text | No | PAN number |
| bank_name | Text | No | Bank name |
| bank_account | Text | No | Account number |
| bank_ifsc | Text | No | IFSC code |
| terms_conditions | Text | No | Terms text |

### Storage Bucket: `business-logos`

- Public read access
- Authenticated write access
- Stores company logos

---

## 🐛 Troubleshooting

### Logo Not Uploading?

1. Check file size (must be < 2MB)
2. Check file format (PNG, JPG, JPEG, GIF)
3. Check internet connection
4. Check browser console for errors

### Settings Not Saving?

1. Ensure you're logged in
2. Check Supabase connection
3. Verify required fields are filled
4. Check browser console for errors

### Settings Not Appearing?

1. Refresh the page
2. Clear browser cache
3. Check if component uses `useBusinessSettings` hook
4. Verify settings are saved in database

---

## 💡 Tips

### Logo Best Practices

✅ Use 200x200px or larger
✅ Use transparent background (PNG)
✅ Keep file size under 500KB
✅ Use square or circular logos

### Company Information

✅ Keep company name concise
✅ Use professional tagline
✅ Provide complete address
✅ Include country code in phone

### Terms & Conditions

✅ Keep clear and concise
✅ Use professional language
✅ Update regularly
✅ Keep under 500 words

---

## 🎉 Benefits

### For You

✅ **Easy Configuration** - Update once, reflect everywhere
✅ **Professional Look** - Consistent branding
✅ **Time Saving** - No need to update multiple places
✅ **Flexibility** - Change anytime

### For Your Business

✅ **Brand Consistency** - Same logo and info everywhere
✅ **Professionalism** - Professional-looking documents
✅ **Compliance** - Include all legal information
✅ **Customer Trust** - Complete business details

---

## 📚 Next Steps

1. **Configure Settings**
   - Go to Settings page
   - Upload your logo
   - Fill in all details
   - Save settings

2. **Test Documents**
   - Generate an invoice
   - View a loan ledger
   - Create an agreement
   - Check if settings appear

3. **Customize Components**
   - Modify `DocumentHeader.tsx` for custom styling
   - Modify `DocumentFooter.tsx` for custom layout
   - Create new document templates

4. **Integrate Everywhere**
   - Use `useBusinessSettings` hook in your components
   - Add `DocumentHeader` and `DocumentFooter` to documents
   - Ensure consistent branding

---

## 🔗 Related Files

- **Full Guide**: `SETTINGS_FEATURE_GUIDE.md`
- **Database Migration**: `supabase/migrations/01_create_business_settings.sql`
- **Settings Page**: `src/pages/Settings.tsx`
- **API Functions**: `src/db/settingsApi.ts`
- **React Hook**: `src/hooks/use-business-settings.ts`
- **Document Components**: `src/components/documents/`

---

**Designed & Developed by:** Vais Engineering Pvt Ltd  
**Copyright:** © 2025 All Rights Reserved

**Ready to configure your business settings? Go to `/settings` now!** 🚀
