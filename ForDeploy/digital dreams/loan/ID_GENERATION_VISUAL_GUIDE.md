# ID Generation Feature - Visual Guide

## Customer ID Generation

### Auto Generate Mode (Default)

```
┌─────────────────────────────────────────────────────────┐
│ Add New Customer                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Customer ID Generation *                              │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Auto Generate                              ▼      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Full Name *                                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Enter full name                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Mobile Number *                                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Enter mobile number                               │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ... (other fields)                                    │
│                                                         │
│  ┌──────────┐                                          │
│  │   Save   │                                          │
│  └──────────┘                                          │
│                                                         │
│  Result: Customer created with ID: CUST000001          │
└─────────────────────────────────────────────────────────┘
```

### Manual Entry Mode

```
┌─────────────────────────────────────────────────────────┐
│ Add New Customer                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Customer ID Generation *                              │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Manual Entry                               ▼      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Customer ID *                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Enter customer ID (e.g., CUST000001)              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Full Name *                                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Enter full name                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Mobile Number *                                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Enter mobile number                               │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ... (other fields)                                    │
│                                                         │
│  ┌──────────┐                                          │
│  │   Save   │                                          │
│  └──────────┘                                          │
│                                                         │
│  Result: Customer created with ID: CUST-2025-001       │
└─────────────────────────────────────────────────────────┘
```

---

## Loan ID Generation

### Auto Generate Mode (Default)

```
┌─────────────────────────────────────────────────────────┐
│ Create New Loan                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Loan ID Generation *                                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Auto Generate                              ▼      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Customer *                                            │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Select customer                            ▼      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Product (Optional)                                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Select product                             ▼      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ... (other fields)                                    │
│                                                         │
│  ┌──────────┐                                          │
│  │   Save   │                                          │
│  └──────────┘                                          │
│                                                         │
│  Result: Loan created with ID: LOAN000001              │
└─────────────────────────────────────────────────────────┘
```

### Manual Entry Mode

```
┌─────────────────────────────────────────────────────────┐
│ Create New Loan                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Loan ID Generation *                                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Manual Entry                               ▼      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Loan ID *                                             │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Enter loan ID (e.g., LOAN000001)                  │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Customer *                                            │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Select customer                            ▼      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Product (Optional)                                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Select product                             ▼      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ... (other fields)                                    │
│                                                         │
│  ┌──────────┐                                          │
│  │   Save   │                                          │
│  └──────────┘                                          │
│                                                         │
│  Result: Loan created with ID: LOAN-2025-001           │
└─────────────────────────────────────────────────────────┘
```

---

## Dropdown Options

### Customer ID Generation Dropdown

```
┌───────────────────────────────────────┐
│ Customer ID Generation *              │
├───────────────────────────────────────┤
│ ✓ Auto Generate                       │
│   Manual Entry                        │
└───────────────────────────────────────┘
```

### Loan ID Generation Dropdown

```
┌───────────────────────────────────────┐
│ Loan ID Generation *                  │
├───────────────────────────────────────┤
│ ✓ Auto Generate                       │
│   Manual Entry                        │
└───────────────────────────────────────┘
```

---

## Validation Messages

### Customer ID - Required Field

```
┌─────────────────────────────────────────────────────────┐
│  Customer ID *                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│  ⚠️ Customer code is required when manual generation   │
│     is selected                                        │
└─────────────────────────────────────────────────────────┘
```

### Loan ID - Required Field

```
┌─────────────────────────────────────────────────────────┐
│  Loan ID *                                             │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│  ⚠️ Loan ID is required when manual generation         │
│     is selected                                        │
└─────────────────────────────────────────────────────────┘
```

### Duplicate ID Error

```
┌─────────────────────────────────────────────────────────┐
│  ❌ Error                                               │
│                                                         │
│  Customer code already exists                          │
│                                                         │
│  Please use a different customer code.                 │
│                                                         │
│  ┌──────────┐                                          │
│  │    OK    │                                          │
│  └──────────┘                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Success Messages

### Customer Created

```
┌─────────────────────────────────────────────────────────┐
│  ✅ Success                                             │
│                                                         │
│  Customer created successfully                         │
│                                                         │
│  Customer ID: CUST000001                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Loan Created

```
┌─────────────────────────────────────────────────────────┐
│  ✅ Success                                             │
│                                                         │
│  Loan created successfully                             │
│                                                         │
│  Loan ID: LOAN000001                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## User Interaction Flow

### Auto Generate Flow

```
1. User opens form
   ↓
2. "Auto Generate" is selected by default
   ↓
3. User fills in other required fields
   ↓
4. User clicks "Save"
   ↓
5. System generates next sequential ID
   ↓
6. Record is created
   ↓
7. Success message displayed
   ↓
8. User redirected to list page
```

### Manual Entry Flow

```
1. User opens form
   ↓
2. User selects "Manual Entry" from dropdown
   ↓
3. ID input field appears
   ↓
4. User enters custom ID
   ↓
5. User fills in other required fields
   ↓
6. User clicks "Save"
   ↓
7. System validates:
   - ID is not empty ✓
   - ID doesn't exist ✓
   ↓
8. Record is created with custom ID
   ↓
9. Success message displayed
   ↓
10. User redirected to list page
```

### Error Handling Flow

```
1. User selects "Manual Entry"
   ↓
2. User enters existing ID
   ↓
3. User clicks "Save"
   ↓
4. System checks for duplicates
   ↓
5. Duplicate found!
   ↓
6. Error message displayed
   ↓
7. User corrects the ID
   ↓
8. User clicks "Save" again
   ↓
9. Validation passes
   ↓
10. Record is created
```

---

## ID Format Examples

### Auto-Generated IDs

**Customer IDs**:
```
CUST000001
CUST000002
CUST000003
CUST000004
...
CUST000099
CUST000100
```

**Loan IDs**:
```
LOAN000001
LOAN000002
LOAN000003
LOAN000004
...
LOAN000099
LOAN000100
```

### Manual Entry Examples

**Customer IDs**:
```
CUST-2025-001        (Year-based)
CUST-BR1-001         (Branch-based)
C12345               (Short format)
CUSTOMER-ABC         (Descriptive)
CUST-DELHI-001       (Location-based)
CUST-VIP-001         (Category-based)
```

**Loan IDs**:
```
LOAN-2025-001        (Year-based)
LOAN-BR1-001         (Branch-based)
L12345               (Short format)
LOAN-PERSONAL-001    (Type-based)
LOAN-MUMBAI-001      (Location-based)
LOAN-GOLD-001        (Category-based)
```

---

## Responsive Design

### Desktop View (2 Columns)

```
┌─────────────────────────────────────────────────────────┐
│  Customer ID Generation *    │  Customer ID *           │
│  ┌─────────────────────────┐ │  ┌────────────────────┐ │
│  │ Manual Entry        ▼   │ │  │ CUST-2025-001      │ │
│  └─────────────────────────┘ │  └────────────────────┘ │
│                                                         │
│  Full Name *                 │  Mobile Number *        │
│  ┌─────────────────────────┐ │  ┌────────────────────┐ │
│  │ John Doe                │ │  │ 9876543210         │ │
│  └─────────────────────────┘ │  └────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Mobile View (1 Column)

```
┌───────────────────────────────┐
│  Customer ID Generation *     │
│  ┌─────────────────────────┐  │
│  │ Manual Entry        ▼   │  │
│  └─────────────────────────┘  │
│                               │
│  Customer ID *                │
│  ┌─────────────────────────┐  │
│  │ CUST-2025-001           │  │
│  └─────────────────────────┘  │
│                               │
│  Full Name *                  │
│  ┌─────────────────────────┐  │
│  │ John Doe                │  │
│  └─────────────────────────┘  │
│                               │
│  Mobile Number *              │
│  ┌─────────────────────────┐  │
│  │ 9876543210              │  │
│  └─────────────────────────┘  │
└───────────────────────────────┘
```

---

## Keyboard Navigation

### Tab Order

```
1. Customer ID Generation dropdown
   ↓ (Tab)
2. Customer ID input (if manual)
   ↓ (Tab)
3. Full Name input
   ↓ (Tab)
4. Mobile Number input
   ↓ (Tab)
... (other fields)
   ↓ (Tab)
N. Save button
```

### Keyboard Shortcuts

- **Tab**: Move to next field
- **Shift + Tab**: Move to previous field
- **Enter**: Submit form (when on Save button)
- **Escape**: Cancel/close form
- **Arrow Up/Down**: Navigate dropdown options

---

## Accessibility Features

### Screen Reader Support

```
"Customer ID Generation, required, dropdown, Auto Generate selected"
"Customer ID, required, text input, Enter customer ID"
"Full Name, required, text input, Enter full name"
```

### ARIA Labels

```html
<Select aria-label="Customer ID Generation">
  <SelectItem value="auto">Auto Generate</SelectItem>
  <SelectItem value="manual">Manual Entry</SelectItem>
</Select>

<Input 
  aria-label="Customer ID" 
  aria-required="true"
  placeholder="Enter customer ID (e.g., CUST000001)"
/>
```

---

## Color Coding

### Field States

**Normal State**:
```
┌───────────────────────────────┐
│ Enter customer ID             │  ← Gray border
└───────────────────────────────┘
```

**Focus State**:
```
┌───────────────────────────────┐
│ Enter customer ID             │  ← Blue border
└───────────────────────────────┘
```

**Error State**:
```
┌───────────────────────────────┐
│ Enter customer ID             │  ← Red border
└───────────────────────────────┘
⚠️ Customer code is required
```

**Success State**:
```
┌───────────────────────────────┐
│ CUST-2025-001                 │  ← Green border
└───────────────────────────────┘
✓ Valid customer code
```

---

## Summary

### Key Visual Elements

✅ **Dropdown Selector**
- Clear label
- Two options
- Default selection

✅ **Conditional Input**
- Appears only when needed
- Clear placeholder
- Validation feedback

✅ **Validation Messages**
- Inline error messages
- Clear instructions
- Color-coded feedback

✅ **Success Notifications**
- Toast notifications
- Confirmation messages
- ID display

### User Experience

✅ **Intuitive**: Clear labels and options  
✅ **Responsive**: Works on all screen sizes  
✅ **Accessible**: Keyboard and screen reader support  
✅ **Validated**: Real-time validation feedback  
✅ **Helpful**: Clear error messages and guidance  

---

**Visual Guide Version**: 1.0  
**Date**: 2025-11-21  
**Status**: ✅ Complete
