# Business Settings Feature Guide
## Complete Configuration System for Digital Dreems CRM

---

## 🎯 Overview

The Business Settings feature allows you to configure all your company details in one place. These settings are automatically reflected across all documents including:

- ✅ **Invoices** - EMI payment receipts
- ✅ **Ledgers** - Customer loan ledgers
- ✅ **Agreements** - Loan agreements
- ✅ **NOC** - No Objection Certificates
- ✅ **Sidebar** - Application branding
- ✅ **All Documents** - Consistent branding everywhere

---

## 📋 Features

### 1. **Company Logo**
- Upload your company logo
- Supported formats: PNG, JPG, JPEG, GIF
- Maximum size: 2MB
- Recommended size: 200x200px
- Automatically displayed in:
  - Sidebar navigation
  - All document headers
  - Print layouts

### 2. **Company Information**
- **Company Name** (Required)
- **Tagline/Slogan**

### 3. **Address Details**
- Address Line 1
- Address Line 2
- City
- State
- PIN Code
- Country

### 4. **Contact Information**
- Primary Phone Number
- Alternate Phone Number
- Email Address
- Website URL

### 5. **Tax & Legal Information**
- GSTIN (GST Identification Number)
- PAN (Permanent Account Number)

### 6. **Bank Details**
- Bank Name
- Account Number
- IFSC Code

### 7. **Terms & Conditions**
- Default terms for all documents
- Appears on invoices and agreements
- Customizable text area

---

## 🚀 How to Use

### Accessing Settings

1. **Login** to your CRM account
2. Click on **"Settings"** in the sidebar menu (gear icon)
3. You'll see the Business Settings page

### Uploading Logo

1. In the **Company Logo** section
2. Click **"Upload Logo"** button
3. Select an image file (PNG, JPG, max 2MB)
4. Logo will be uploaded and displayed immediately
5. Old logo is automatically replaced

### Updating Company Information

1. Fill in the **Company Name** (required field)
2. Add your **Tagline** (optional)
3. Click **"Save Settings"** at the bottom

### Configuring Address

1. Enter your business address in the **Address Details** section
2. Fill in:
   - Address Line 1 (Building/Street)
   - Address Line 2 (Area/Locality)
   - City
   - State
   - PIN Code
   - Country
3. Click **"Save Settings"**

### Adding Contact Details

1. In the **Contact Information** section
2. Enter:
   - Primary Phone (with country code)
   - Alternate Phone (optional)
   - Email Address
   - Website URL (must start with https://)
3. Click **"Save Settings"**

### Setting Up Tax Information

1. In the **Tax & Legal Information** section
2. Enter:
   - GSTIN (format: 22AAAAA0000A1Z5)
   - PAN (format: AAAAA0000A)
3. Click **"Save Settings"**

### Configuring Bank Details

1. In the **Bank Details** section
2. Enter:
   - Bank Name
   - Account Number
   - IFSC Code
3. These will appear on payment documents
4. Click **"Save Settings"**

### Customizing Terms & Conditions

1. In the **Terms & Conditions** section
2. Enter your default terms
3. This text will appear on:
   - Loan agreements
   - Invoices
   - NOC documents
4. Click **"Save Settings"**

---

## 📄 Where Settings Appear

### 1. **Sidebar Navigation**

```
┌─────────────────────┐
│  [LOGO]             │
│  Company Name       │
│  Tagline            │
├─────────────────────┤
│  Dashboard          │
│  Customers          │
│  ...                │
└─────────────────────┘
```

**What's shown:**
- Company logo (if uploaded)
- Company name
- Tagline

---

### 2. **Document Headers**

All documents (invoices, ledgers, agreements, NOC) include:

```
┌────────────────────────────────────────────────┐
│  [LOGO]  Company Name                          │
│          Tagline                               │
│          Address Line 1                        │
│          Address Line 2                        │
│          City, State, PIN Code                 │
│          Country                               │
│                                                │
│  Phone: +91 XXXXXXXXXX  Email: info@...       │
│  GSTIN: XXXXXXXXXXXX    PAN: XXXXXXXXXX        │
└────────────────────────────────────────────────┘
```

---

### 3. **Document Footers**

```
┌────────────────────────────────────────────────┐
│  Bank Details for Payment                      │
│  Bank Name: State Bank of India                │
│  Account Number: 1234567890                    │
│  IFSC Code: SBIN0001234                        │
│                                                │
│  Terms & Conditions                            │
│  [Your custom terms text here]                 │
│                                                │
│  This is a computer-generated document from    │
│  Company Name                                  │
│  For queries, contact: email | phone           │
└────────────────────────────────────────────────┘
```

---

## 🔧 Technical Details

### Database Structure

Settings are stored in Supabase database:

**Table:** `business_settings`

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| company_name | Text | Company name (required) |
| tagline | Text | Company tagline |
| logo_url | Text | URL to uploaded logo |
| address_line1 | Text | Address line 1 |
| address_line2 | Text | Address line 2 |
| city | Text | City |
| state | Text | State |
| pincode | Text | PIN code |
| country | Text | Country |
| phone | Text | Primary phone |
| alternate_phone | Text | Secondary phone |
| email | Text | Email address |
| website | Text | Website URL |
| gstin | Text | GST number |
| pan | Text | PAN number |
| bank_name | Text | Bank name |
| bank_account | Text | Account number |
| bank_ifsc | Text | IFSC code |
| terms_conditions | Text | Terms & conditions |
| created_at | Timestamp | Creation time |
| updated_at | Timestamp | Last update time |

### Storage

**Bucket:** `business-logos`
- Public access for viewing
- Authenticated users can upload/update/delete
- Automatic URL generation

### API Functions

**File:** `src/db/settingsApi.ts`

```typescript
// Get settings
getBusinessSettings(): Promise<BusinessSettings | null>

// Update settings
updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings>

// Upload logo
uploadLogo(file: File): Promise<string>

// Delete logo
deleteLogo(logoUrl: string): Promise<void>
```

### React Hook

**File:** `src/hooks/use-business-settings.ts`

```typescript
const { settings, loading, error, refresh } = useBusinessSettings();
```

Use this hook in any component to access business settings.

### Document Components

**File:** `src/components/documents/DocumentHeader.tsx`

```tsx
import DocumentHeader from "@/components/documents/DocumentHeader";

<DocumentHeader settings={settings} title="Invoice" />
```

**File:** `src/components/documents/DocumentFooter.tsx`

```tsx
import DocumentFooter from "@/components/documents/DocumentFooter";

<DocumentFooter 
  settings={settings} 
  showTerms={true}
  showBankDetails={true}
/>
```

---

## 💡 Usage Examples

### Example 1: Using Settings in a Custom Component

```tsx
import { useBusinessSettings } from "@/hooks/use-business-settings";

export default function MyComponent() {
  const { settings, loading } = useBusinessSettings();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{settings?.company_name}</h1>
      <p>{settings?.tagline}</p>
    </div>
  );
}
```

### Example 2: Creating a Custom Invoice

```tsx
import { useBusinessSettings } from "@/hooks/use-business-settings";
import DocumentHeader from "@/components/documents/DocumentHeader";
import DocumentFooter from "@/components/documents/DocumentFooter";

export default function Invoice() {
  const { settings } = useBusinessSettings();

  return (
    <div className="p-8 bg-white">
      <DocumentHeader settings={settings} title="INVOICE" />
      
      {/* Your invoice content here */}
      <div className="my-8">
        <h2>Invoice Details</h2>
        {/* ... */}
      </div>
      
      <DocumentFooter 
        settings={settings} 
        showTerms={true}
        showBankDetails={true}
      />
    </div>
  );
}
```

### Example 3: Updating Settings Programmatically

```tsx
import { updateBusinessSettings } from "@/db/settingsApi";

const handleUpdate = async () => {
  try {
    await updateBusinessSettings({
      company_name: "New Company Name",
      tagline: "New Tagline",
      phone: "+91 9876543210"
    });
    console.log("Settings updated!");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## 🎨 Customization

### Styling Document Headers

The `DocumentHeader` component uses Tailwind CSS classes. You can customize by:

1. Editing `src/components/documents/DocumentHeader.tsx`
2. Modifying classes like:
   - `text-2xl font-bold` - Company name size
   - `w-20 h-20` - Logo size
   - `border-b pb-6 mb-6` - Header spacing

### Styling Document Footers

Edit `src/components/documents/DocumentFooter.tsx` to customize:
- Bank details layout
- Terms & conditions formatting
- Footer note appearance

---

## 🔒 Security

### Access Control

- Settings page is accessible to all authenticated users
- Only authenticated users can upload/update logos
- No Row Level Security (RLS) on settings table
- Settings are public within the application

### Logo Upload Security

- File type validation (images only)
- File size limit (2MB)
- Automatic old logo deletion
- Secure storage in Supabase

---

## 🐛 Troubleshooting

### Logo Not Uploading

**Problem:** Logo upload fails

**Solutions:**
1. Check file size (must be < 2MB)
2. Verify file format (PNG, JPG, JPEG, GIF)
3. Check internet connection
4. Verify Supabase storage is configured
5. Check browser console for errors

### Settings Not Saving

**Problem:** Changes don't persist

**Solutions:**
1. Check if you're logged in
2. Verify Supabase connection
3. Check browser console for errors
4. Ensure required fields are filled (company_name)
5. Try refreshing the page

### Settings Not Appearing in Documents

**Problem:** Updated settings don't show in documents

**Solutions:**
1. Refresh the page
2. Clear browser cache
3. Check if document component uses `useBusinessSettings` hook
4. Verify settings are saved in database
5. Check console for API errors

### Logo Not Displaying

**Problem:** Logo shows placeholder icon

**Solutions:**
1. Verify logo was uploaded successfully
2. Check logo URL in settings
3. Ensure logo file is accessible
4. Check browser console for 404 errors
5. Try re-uploading the logo

---

## 📊 Best Practices

### 1. **Logo Guidelines**

✅ **Do:**
- Use high-resolution images (200x200px or larger)
- Use transparent backgrounds (PNG)
- Keep file size under 500KB for faster loading
- Use square or circular logos

❌ **Don't:**
- Use very large files (> 2MB)
- Use low-resolution images
- Use complex backgrounds

### 2. **Company Information**

✅ **Do:**
- Keep company name concise
- Use a clear, professional tagline
- Provide complete address
- Include country code in phone numbers

❌ **Don't:**
- Use very long company names
- Leave required fields empty
- Use informal language

### 3. **Terms & Conditions**

✅ **Do:**
- Keep terms clear and concise
- Use professional language
- Include important policies
- Update regularly

❌ **Don't:**
- Write very long terms (keep under 500 words)
- Use legal jargon customers won't understand
- Forget to update when policies change

### 4. **Bank Details**

✅ **Do:**
- Double-check account numbers
- Verify IFSC codes
- Include bank branch name
- Keep information up-to-date

❌ **Don't:**
- Share bank details publicly outside the app
- Use personal bank accounts for business
- Forget to update if bank changes

---

## 🚀 Future Enhancements

### Planned Features

1. **Multiple Logo Support**
   - Different logos for different document types
   - Watermark support
   - Signature upload

2. **Multi-Language Support**
   - Translate company details
   - Regional language support
   - Currency settings

3. **Document Templates**
   - Multiple invoice templates
   - Custom agreement templates
   - Branded email templates

4. **Advanced Customization**
   - Color scheme picker
   - Font selection
   - Layout options

5. **Backup & Restore**
   - Export settings as JSON
   - Import settings from file
   - Settings history/versioning

---

## 📞 Support

### Getting Help

If you encounter issues with the Settings feature:

1. **Check Documentation**: Review this guide
2. **Check Console**: Look for error messages in browser console
3. **Verify Database**: Ensure Supabase is connected
4. **Contact Support**: Reach out to Vais Engineering

### Useful Commands

```bash
# Check Supabase connection
# Open browser console and run:
console.log(import.meta.env.VITE_SUPABASE_URL);

# Test settings API
# In browser console:
import { getBusinessSettings } from '@/db/settingsApi';
getBusinessSettings().then(console.log);
```

---

## 📝 Summary

### What You Can Configure

✅ Company logo (upload image)
✅ Company name and tagline
✅ Complete business address
✅ Contact information (phone, email, website)
✅ Tax details (GSTIN, PAN)
✅ Bank account details
✅ Terms and conditions

### Where It Appears

✅ Sidebar navigation
✅ All document headers
✅ All document footers
✅ Invoices and receipts
✅ Loan ledgers
✅ Loan agreements
✅ NOC certificates

### Benefits

✅ **Consistency** - Same branding everywhere
✅ **Professionalism** - Professional-looking documents
✅ **Efficiency** - Update once, reflect everywhere
✅ **Flexibility** - Easy to change anytime
✅ **Compliance** - Include all legal information

---

**Designed & Developed by:** Vais Engineering Pvt Ltd  
**Copyright:** © 2025 All Rights Reserved

**Need Help?** Contact support@vaisengineering.com
