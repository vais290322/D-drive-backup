# CRM Integration Guide

## Overview
A comprehensive Customer Relationship Management (CRM) system has been integrated into your application, providing powerful tools to manage companies, contacts, deals, and sales pipelines.

## Features Implemented

### 1. CRM Dashboard
- **Location**: `/crm` or `/crm/dashboard`
- **Features**:
  - Overview statistics (companies, contacts, deals, revenue)
  - Quick action buttons for common tasks
  - Visual metrics with color-coded cards
  - Direct navigation to all CRM sections

### 2. Company Management
- **Location**: `/crm/companies`
- **Features**:
  - Complete company database
  - Add, edit, and delete companies
  - Search and filter functionality
  - Company details including:
    - Basic info (name, industry, website)
    - Contact information (phone, email)
    - Address details
    - Employee count and annual revenue
    - Custom notes

### 3. Contact Management
- **Location**: `/crm/contacts`
- **Features**:
  - Comprehensive contact database
  - Link contacts to companies
  - Track lead status (new, contacted, qualified, unqualified)
  - Contact details including:
    - Personal information
    - Multiple phone numbers and email
    - Job title and department
    - Address information
    - Social media profiles (LinkedIn, Twitter)
    - Lead source tracking
    - Custom notes

### 4. Sales Pipeline (Deals)
- **Location**: `/crm/deals`
- **Features**:
  - Kanban-style pipeline visualization
  - Six deal stages:
    - Lead
    - Qualified
    - Proposal
    - Negotiation
    - Won
    - Lost
  - Drag-and-drop stage management
  - Deal details including:
    - Title and description
    - Associated company and contact
    - Deal value and currency
    - Win probability percentage
    - Expected close date
    - Priority levels (low, medium, high)
    - Custom notes
  - Pipeline value tracking
  - Revenue reporting

## Database Schema

### Tables Created
1. **companies** - Store company information
2. **contacts** - Store contact/lead information
3. **deals** - Store sales opportunities
4. **activities** - Track interactions (calls, emails, meetings, notes)
5. **tasks** - Manage follow-up tasks

### Relationships
- Contacts can be linked to Companies
- Deals can be linked to both Companies and Contacts
- Activities and Tasks can be linked to Companies, Contacts, and Deals

## API Functions

All CRM operations are handled through `/src/db/crmApi.ts`:

### Companies
- `getCompanies()` - Fetch all companies
- `getCompanyById(id)` - Get single company
- `createCompany(data)` - Create new company
- `updateCompany(id, data)` - Update company
- `deleteCompany(id)` - Delete company

### Contacts
- `getContacts()` - Fetch all contacts with company info
- `getContactById(id)` - Get single contact
- `getContactsByCompany(companyId)` - Get contacts for a company
- `createContact(data)` - Create new contact
- `updateContact(id, data)` - Update contact
- `deleteContact(id)` - Delete contact

### Deals
- `getDeals()` - Fetch all deals with relations
- `getDealById(id)` - Get single deal
- `getDealsByStage(stage)` - Get deals by pipeline stage
- `createDeal(data)` - Create new deal
- `updateDeal(id, data)` - Update deal
- `deleteDeal(id)` - Delete deal

### Activities
- `getActivities(filters)` - Fetch activities with optional filters
- `createActivity(data)` - Log new activity
- `deleteActivity(id)` - Delete activity

### Tasks
- `getTasks(filters)` - Fetch tasks with optional filters
- `createTask(data)` - Create new task
- `updateTask(id, data)` - Update task
- `completeTask(id)` - Mark task as completed
- `deleteTask(id)` - Delete task

### Dashboard Stats
- `getCRMStats()` - Get comprehensive CRM statistics

## Navigation

The CRM section is accessible from the main navigation menu with a "CRM" link. From the CRM dashboard, you can navigate to:
- Companies list
- Contacts list
- Sales pipeline (Deals)
- Activities (future)
- Tasks (future)

## Data Flow

1. **Create Companies** - Start by adding companies to your database
2. **Add Contacts** - Create contacts and link them to companies
3. **Create Deals** - Set up sales opportunities linked to companies and contacts
4. **Track Progress** - Move deals through pipeline stages
5. **Log Activities** - Record interactions with contacts and companies
6. **Manage Tasks** - Create follow-up tasks and reminders

## Integration with Existing System

The CRM system is fully integrated with your existing loan management system:
- Separate database tables for CRM data
- Independent navigation and routing
- Shared design system and UI components
- Common authentication and user management

## Backend Configuration

### Supabase Setup
- **URL**: Configured in `.env` as `VITE_SUPABASE_URL`
- **Key**: Configured in `.env` as `VITE_SUPABASE_ANON_KEY`
- **Client**: Initialized in `/src/db/supabase.ts`

### Security
- No Row Level Security (RLS) enabled for maximum flexibility
- All users have full CRUD access to CRM data
- Suitable for single-tenant or trusted multi-user environments

## Future Enhancements

The following features are planned but not yet implemented:
- Activity timeline and logging
- Task management interface
- Email integration
- Calendar synchronization
- Advanced reporting and analytics
- Import/Export functionality (CSV, Excel)
- Custom fields and tags
- Deal forecasting
- Sales team collaboration features

## Troubleshooting

### Backend Not Working
If you're experiencing backend issues:

1. **Check Supabase Connection**:
   - Verify `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Check browser console for connection errors

2. **Verify Database Tables**:
   - Ensure all migrations have been applied
   - Check Supabase dashboard for table existence

3. **API Errors**:
   - Open browser DevTools Console
   - Look for error messages from API calls
   - Check Network tab for failed requests

4. **Clear Cache**:
   - Clear browser cache and reload
   - Try in incognito/private browsing mode

### Common Issues

**Issue**: "Failed to load companies/contacts/deals"
- **Solution**: Check Supabase connection and verify tables exist

**Issue**: "Failed to create/update record"
- **Solution**: Check form validation and required fields

**Issue**: Navigation not showing CRM link
- **Solution**: Verify routes are properly configured in `/src/routes.tsx`

## Support

For additional help:
1. Check browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase project is active and healthy
4. Review the CRM API functions in `/src/db/crmApi.ts`

## Summary

Your CRM integration is now complete with:
- ✅ Full company management
- ✅ Comprehensive contact database
- ✅ Visual sales pipeline
- ✅ Deal tracking and management
- ✅ Dashboard with key metrics
- ✅ Search and filtering capabilities
- ✅ Responsive design for desktop and mobile
- ✅ Integration with Supabase backend

The system is ready to use and can be accessed through the CRM link in your main navigation menu.
