# A4 Print Format - Quick Reference Guide

## 🎯 Quick Start

### Standard A4 Container Template

```tsx
<div style={{ 
  width: "210mm",              // ✅ Fixed A4 width
  minHeight: "297mm",          // ✅ A4 height
  padding: "20mm",             // ✅ Standard margins
  margin: "0 auto",            // ✅ Center on page
  fontFamily: "Arial, sans-serif",
  fontSize: "12pt",            // ✅ Print-friendly size
  lineHeight: "1.6",
  boxSizing: "border-box",     // ✅ Include padding in width
  background: "white",
  color: "black"
}}>
  {/* Your content here */}
</div>
```

---

## 📏 A4 Dimensions

| Measurement | Value |
|-------------|-------|
| Width | 210mm (8.27 inches) |
| Height | 297mm (11.69 inches) |
| Margins | 20mm (all sides) |
| Printable Width | 170mm (210mm - 40mm) |
| Printable Height | 257mm (297mm - 40mm) |

---

## ✅ Checklist for A4 Print Components

### Required Styles

- [ ] `width: "210mm"` (not maxWidth)
- [ ] `minHeight: "297mm"`
- [ ] `padding: "20mm"`
- [ ] `boxSizing: "border-box"`
- [ ] `fontFamily: "Arial, sans-serif"`
- [ ] `fontSize: "12pt"` (or 10-14pt)
- [ ] `background: "white"`
- [ ] `color: "black"`

### Typography

- [ ] Use `pt` units for font sizes (not px)
- [ ] Main title: 20-28pt
- [ ] Section headings: 14-16pt
- [ ] Body text: 10-12pt
- [ ] Small text: 9-10pt

### Layout

- [ ] Use inline styles (not CSS classes)
- [ ] Use tables for complex layouts
- [ ] Avoid flexbox for print
- [ ] Test in print preview

---

## 🎨 Typography Scale

```tsx
// Main Title
fontSize: "24pt"

// Section Title
fontSize: "20pt"

// Subsection
fontSize: "14pt"

// Body Text
fontSize: "12pt"

// Labels
fontSize: "10pt"

// Small Text
fontSize: "9pt"
```

---

## 🖨️ Print Settings

### Browser Settings

**Chrome/Edge**:
```
Paper size: A4
Margins: None
Scale: 100%
Background graphics: ✅ Enabled
```

**Firefox**:
```
Paper size: A4
Margins: None
Scale: 100%
Print backgrounds: ✅ Enabled
```

---

## 🚫 Common Mistakes

### ❌ DON'T

```tsx
// ❌ Using maxWidth instead of width
maxWidth: "210mm"

// ❌ No height specified
// (missing minHeight)

// ❌ Using px for fonts
fontSize: "16px"

// ❌ Using Tailwind classes
className="p-8 max-w-4xl"

// ❌ Missing box-sizing
// (causes width overflow)

// ❌ Using flexbox
display: "flex"
```

### ✅ DO

```tsx
// ✅ Fixed width
width: "210mm"

// ✅ Minimum height
minHeight: "297mm"

// ✅ Using pt for fonts
fontSize: "12pt"

// ✅ Inline styles
style={{ padding: "20mm" }}

// ✅ Proper box-sizing
boxSizing: "border-box"

// ✅ Using tables
<table style={{ width: "100%" }}>
```

---

## 📋 Component Examples

### Simple Receipt

```tsx
export function SimpleReceipt() {
  return (
    <div style={{ 
      width: "210mm",
      minHeight: "297mm",
      padding: "20mm",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif",
      fontSize: "12pt",
      background: "white",
      color: "black"
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: "2px solid #000",
        paddingBottom: "15px",
        marginBottom: "20px"
      }}>
        <h1 style={{ fontSize: "24pt", margin: 0 }}>
          Receipt
        </h1>
      </div>

      {/* Content */}
      <div style={{ marginBottom: "20px" }}>
        <p>Receipt content here...</p>
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: "2px solid #000",
        paddingTop: "15px",
        marginTop: "40px"
      }}>
        <p style={{ fontSize: "10pt", margin: 0 }}>
          Thank you!
        </p>
      </div>
    </div>
  );
}
```

### Two-Column Layout

```tsx
<table style={{ 
  width: "100%", 
  marginBottom: "20px",
  borderCollapse: "collapse"
}}>
  <tbody>
    <tr>
      <td style={{ 
        width: "50%", 
        padding: "15px",
        verticalAlign: "top"
      }}>
        <h3 style={{ fontSize: "14pt", margin: "0 0 10px 0" }}>
          Left Column
        </h3>
        <p style={{ fontSize: "11pt", margin: 0 }}>
          Content here...
        </p>
      </td>
      <td style={{ 
        width: "50%", 
        padding: "15px",
        verticalAlign: "top"
      }}>
        <h3 style={{ fontSize: "14pt", margin: "0 0 10px 0" }}>
          Right Column
        </h3>
        <p style={{ fontSize: "11pt", margin: 0 }}>
          Content here...
        </p>
      </td>
    </tr>
  </tbody>
</table>
```

---

## 🎨 Color Palette

### Professional Colors

```tsx
// Primary Blue
primary: "#1e40af"
primaryLight: "#3b82f6"
primaryLighter: "#dbeafe"

// Success Green
success: "#22c55e"
successLight: "#16a34a"
successLighter: "#dcfce7"

// Warning Yellow
warning: "#f59e0b"
warningLight: "#fbbf24"
warningLighter: "#fef3c7"

// Gray Scale
darkGray: "#1e293b"
mediumGray: "#475569"
lightGray: "#64748b"
veryLightGray: "#f8fafc"

// Borders
border: "#e2e8f0"
borderLight: "#cbd5e1"
```

---

## 🔧 Utility Functions

### Format Currency

```tsx
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};
```

### Format Date

```tsx
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
```

### Format Time

```tsx
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
```

---

## 🧪 Testing Checklist

### Before Committing

- [ ] Open print preview (Ctrl+P / Cmd+P)
- [ ] Verify paper size shows as A4
- [ ] Check no content is cut off
- [ ] Verify all text is readable
- [ ] Check colors appear correctly
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari (if available)
- [ ] Test actual printing on A4 paper

### Print Preview Checks

- [ ] Width is exactly 210mm
- [ ] Height is at least 297mm
- [ ] Margins are 20mm on all sides
- [ ] No horizontal scrollbar
- [ ] No content overflow
- [ ] Page breaks are appropriate
- [ ] Headers/footers are visible

---

## 📱 Print Handler Template

```tsx
const printRef = useRef<HTMLDivElement>(null);

const handlePrint = () => {
  setTimeout(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow && printRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Document Title</title>
            <style>
              @media print {
                @page { 
                  size: A4;
                  margin: 0;
                }
                body { 
                  margin: 0; 
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${printRef.current.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, 100);
};
```

---

## 🐛 Troubleshooting

### Content Cut Off?

1. Check `boxSizing: "border-box"` is set
2. Verify width is `210mm` (not maxWidth)
3. Check padding is `20mm` (included in width)
4. Ensure no fixed widths larger than 170mm inside

### Wrong Page Size?

1. Verify `width: "210mm"` (not maxWidth)
2. Check `minHeight: "297mm"` is set
3. Clear browser cache
4. Check print settings (Paper size: A4)

### Colors Not Printing?

1. Enable "Background graphics" in print settings
2. Use solid colors (not gradients for critical elements)
3. Check printer color settings

### Fonts Too Small?

1. Use minimum 10pt for body text
2. Use 12pt for better readability
3. Test actual print output

---

## 📚 Resources

### Files to Reference

- `src/components/loan/PaymentReceipt.tsx` - Complete example
- `src/components/loan/NOC.tsx` - Certificate format
- `src/components/loan/LedgerPrint.tsx` - Table layout
- `src/components/loan/LoanAgreement.tsx` - Legal document

### Documentation

- `PRINT_A4_FORMAT_COMPLETE.md` - Full documentation
- `A4_FORMAT_UPDATE_SUMMARY.md` - Update details
- `PRINT_FIX_SUMMARY.md` - Print fix details

---

## 🎯 Quick Tips

1. **Always use inline styles** for print components
2. **Use mm units** for dimensions
3. **Use pt units** for font sizes
4. **Test in print preview** before committing
5. **Use tables** for complex layouts
6. **Avoid flexbox** for print
7. **Set boxSizing** to border-box
8. **Use fixed width** (not maxWidth)
9. **Add minHeight** for full page
10. **Test actual printing** on A4 paper

---

## ✅ Final Checklist

Before marking as complete:

- [ ] Component uses `width: "210mm"`
- [ ] Component uses `minHeight: "297mm"`
- [ ] Component uses `padding: "20mm"`
- [ ] Component uses `boxSizing: "border-box"`
- [ ] All styles are inline
- [ ] Font sizes use pt units
- [ ] Tested in print preview
- [ ] No content overflow
- [ ] Colors print correctly
- [ ] Tested in multiple browsers
- [ ] Tested actual printing

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2025-11-21  
**Status**: ✅ Complete
