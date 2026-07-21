# Digital Dreems Loan Management CRM - Quick Reference Guide

## 🚀 Quick Start

### First Time Setup
1. Set up Supabase project
2. Configure Google OAuth
3. Run database migration
4. Set environment variables in `.env`
5. Build and deploy application
6. First user login becomes Super Admin

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Open global search |
| `Tab` | Navigate form fields |
| `Enter` | Submit forms |
| `Esc` | Close dialogs |

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full access, user management, role assignment |
| **Admin** | Manage all data, cannot assign roles |
| **Loan Manager** | Create loans, manage collections, add penalties |
| **Collection Agent** | View loans, record payments |
| **Data Entry Staff** | Add/edit customers and products |
| **KYC Verifier** | Verify customer KYC documents |

---

## 📋 Common Workflows

### 1. Customer Onboarding
```
1. Navigate to Customers → Add New Customer
2. Fill Basic Information tab
3. Fill Address Information tab
4. Fill KYC Details tab
5. Fill Bank Details tab
6. Click Save
7. KYC Verifier approves KYC
```

### 2. Create Loan
```
1. Navigate to Loans → Create New Loan
2. Select Customer
3. Select Product
4. Enter Loan Details
5. Calculate EMI (choose Flat or Reducing)
6. Add Guarantor (optional)
7. Click Create Loan
```

### 3. Collect EMI
```
1. Navigate to Collections
2. Find active loan
3. Click "Collect Payment"
4. Enter amount and payment mode
5. Add transaction reference
6. Click Record Payment
```

### 4. Add Penalty
```
1. Navigate to loan detail page
2. Click "Add Penalty"
3. Select penalty type
4. Enter amount and reason
5. Click Add Penalty
```

### 5. Verify KYC
```
1. Navigate to customer detail page
2. Review KYC documents
3. Click "Verify KYC" or "Reject KYC"
4. Add remarks
5. Confirm action
```

---

## 🔍 Search Tips

### Global Search (Ctrl+K)
- **Customers**: Search by name, mobile, email, customer code
- **Products**: Search by brand, model, IMEI, serial number, product code
- **Loans**: Search by loan ID

### Page-Level Search
- Use search boxes on list pages
- Filters available on loan list (status, customer)
- Real-time search as you type

---

## 📊 Dashboard Metrics

| Metric | Description |
|--------|-------------|
| **Total Customers** | All registered customers |
| **Active Loans** | Loans with outstanding balance |
| **Completed Loans** | Fully paid loans |
| **Delayed EMIs** | Loans with overdue payments |
| **Today's Collection** | Payments received today |
| **Total Outstanding** | Sum of all unpaid amounts |
| **Total Disbursed** | Total loan amount given |

---

## 💰 EMI Calculation Methods

### Flat Interest
```
Total Interest = Principal × Rate × Tenure
Total Payable = Principal + Total Interest + Fees
EMI = Total Payable / Number of Installments
```

### Reducing Balance
```
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
Where:
P = Principal
R = Monthly interest rate
N = Number of months
```

---

## 📝 Form Validation Rules

### Customer Form
- **Full Name**: Required, min 2 characters
- **Mobile**: Required, 10 digits
- **Email**: Valid email format
- **Date of Birth**: Must be 18+ years old
- **Aadhaar**: 12 digits
- **PAN**: 10 characters (XXXXX9999X format)

### Product Form
- **Category**: Required
- **Brand**: Required
- **Model**: Required
- **Serial Number**: Required
- **Purchase Price**: Required, positive number

### Loan Form
- **Customer**: Required
- **Product**: Required
- **Principal Amount**: Required, positive number
- **Tenure**: Required, 1-60 months
- **Interest Rate**: Required, 0-100%
- **Start Date**: Required
- **First EMI Date**: Required, after start date

---

## 🎨 Status Indicators

### KYC Status
- 🟡 **Pending**: Awaiting verification
- 🟢 **Verified**: KYC approved
- 🔴 **Rejected**: KYC rejected

### Loan Status
- 🟢 **Active**: Loan is ongoing
- 🔵 **Completed**: Loan fully paid
- 🔴 **Overdue**: Payment delayed

### Product Status
- 🟢 **Available**: Ready for loan
- 🟡 **Assigned**: Currently on loan
- 🔴 **Sold**: Permanently sold

---

## 🔐 Security Best Practices

### For Administrators
1. Assign appropriate roles to users
2. Review user access regularly
3. Monitor loan activities
4. Verify KYC documents thoroughly
5. Keep Super Admin role limited

### For Users
1. Sign out after use
2. Don't share login credentials
3. Verify customer information before loan creation
4. Double-check payment amounts
5. Add remarks for important actions

---

## 📱 Mobile Usage Tips

### Navigation
- Use hamburger menu (☰) for navigation
- Swipe to close side menu
- Tap search icon for global search
- Use bottom navigation on small screens

### Forms
- Forms are optimized for mobile
- Use native date pickers
- Dropdown menus are touch-friendly
- Validation messages appear inline

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Can't login  
**Solution**: Ensure Google OAuth is configured correctly

**Issue**: Search not working  
**Solution**: Type at least 2 characters

**Issue**: EMI calculation incorrect  
**Solution**: Verify interest rate and tenure inputs

**Issue**: Can't assign roles  
**Solution**: Only Super Admin can assign roles

**Issue**: Payment not recorded  
**Solution**: Check loan status is "Active"

---

## 📞 Support Contacts

**System Name**: Digital Dreems Loan Management CRM  
**Version**: 1.0.0  
**Developer**: Vais Engineering Pvt Ltd  

### Documentation
- **README.md**: Project overview
- **SYSTEM_GUIDE.md**: Detailed user guide
- **QUICK_START.md**: 5-minute setup
- **DEPLOYMENT_CHECKLIST.md**: Deployment steps
- **FEATURES_IMPLEMENTED.md**: Complete feature list

---

## 🔄 Regular Maintenance

### Daily Tasks
- Monitor today's collection
- Check delayed EMIs
- Review pending KYC verifications
- Record EMI payments

### Weekly Tasks
- Review active loans
- Check product inventory
- Monitor user activities
- Generate reports

### Monthly Tasks
- Review completed loans
- Analyze collection efficiency
- Update product prices
- Backup database

---

## 📈 Reporting

### Available Reports
- Customer list with KYC status
- Product inventory
- Active loans
- Payment history
- Penalty history
- Loan ledger

### Export Options
- View on screen
- Print (Ctrl+P)
- PDF export (coming soon)
- Excel export (coming soon)

---

## 🎯 Best Practices

### Customer Management
1. Complete all KYC details
2. Verify documents before approval
3. Keep contact information updated
4. Maintain accurate address records

### Loan Management
1. Verify customer KYC before loan creation
2. Check product availability
3. Calculate EMI accurately
4. Add guarantor for high-value loans
5. Set realistic repayment schedules

### Collection Management
1. Record payments promptly
2. Add transaction references
3. Issue receipts
4. Follow up on delayed payments
5. Apply penalties consistently

---

## 💡 Pro Tips

1. **Use Global Search**: Press Ctrl+K to quickly find any record
2. **Keyboard Navigation**: Use Tab to move between form fields
3. **Quick Actions**: Use dashboard quick actions for common tasks
4. **Filter Loans**: Use status filters to focus on specific loans
5. **Check Dashboard**: Review dashboard daily for key metrics
6. **Add Remarks**: Always add remarks for important actions
7. **Verify Before Submit**: Double-check all information before saving
8. **Use Partial Payments**: Record partial payments when full EMI not received
9. **Monitor Penalties**: Review penalty history regularly
10. **Keep Records**: Maintain proper documentation for all transactions

---

## 🔗 Quick Links

### Main Pages
- **Dashboard**: `/`
- **Customers**: `/customers`
- **Products**: `/products`
- **Loans**: `/loans`
- **Collections**: `/collections`
- **Users**: `/users`

### Common Actions
- **Add Customer**: `/customers/new`
- **Add Product**: `/products/new`
- **Create Loan**: `/loans/new`
- **Collect EMI**: `/collections`

---

## 📚 Additional Resources

### Learning Resources
1. Read SYSTEM_GUIDE.md for detailed instructions
2. Watch demo videos (if available)
3. Practice with test data
4. Attend training sessions

### Technical Resources
1. Supabase documentation
2. React documentation
3. TypeScript documentation
4. Tailwind CSS documentation

---

**Digital Dreems Loan Management CRM**  
Quick Reference Guide v1.0.0  
© 2025 Vais Engineering Pvt Ltd  
All Rights Reserved
