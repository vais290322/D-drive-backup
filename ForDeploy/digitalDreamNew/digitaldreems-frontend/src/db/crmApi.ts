/**
 * CRM API Layer for MongoDB Backend
 * Handles all CRM-related database operations via HTTP to Express backend
 */

import type {
    Company,
    Contact,
    Deal,
    Activity,
    Task,
    ContactWithCompany,
    DealWithRelations,
    ActivityWithRelations,
    TaskWithRelations,
} from '@/types/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const getToken = (): string | null => localStorage.getItem('auth_token');

async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return await response.json();
}

// ==================== Companies ====================

export async function getCompanies(): Promise<Company[]> {
    try {
        return await apiCall<Company[]>('/crm/companies');
    } catch (error) {
        console.error('Error fetching companies:', error);
        return [];
    }
}

export async function getCompanyById(id: string): Promise<Company | null> {
    try {
        return await apiCall<Company>(`/crm/companies/${id}`);
    } catch (error) {
        console.error('Error fetching company:', error);
        return null;
    }
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company | null> {
    try {
        return await apiCall<Company>('/crm/companies', {
            method: 'POST',
            body: JSON.stringify(company),
        });
    } catch (error: any) {
        console.error('Error creating company:', error);
        throw new Error(error.message);
    }
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    try {
        return await apiCall<Company>(`/crm/companies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    } catch (error: any) {
        console.error('Error updating company:', error);
        throw new Error(error.message);
    }
}

export async function deleteCompany(id: string): Promise<boolean> {
    try {
        await apiCall(`/crm/companies/${id}`, { method: 'DELETE' });
        return true;
    } catch (error: any) {
        console.error('Error deleting company:', error);
        throw new Error(error.message);
    }
}

// ==================== Contacts ====================

export async function getContacts(): Promise<ContactWithCompany[]> {
    try {
        return await apiCall<ContactWithCompany[]>('/crm/contacts');
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }
}

export async function getContactById(id: string): Promise<ContactWithCompany | null> {
    try {
        return await apiCall<ContactWithCompany>(`/crm/contacts/${id}`);
    } catch (error) {
        console.error('Error fetching contact:', error);
        return null;
    }
}

export async function getContactsByCompany(companyId: string): Promise<Contact[]> {
    try {
        return await apiCall<Contact[]>(`/crm/contacts/company/${companyId}`);
    } catch (error) {
        console.error('Error fetching contacts by company:', error);
        return [];
    }
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact | null> {
    try {
        return await apiCall<Contact>('/crm/contacts', {
            method: 'POST',
            body: JSON.stringify(contact),
        });
    } catch (error: any) {
        console.error('Error creating contact:', error);
        throw new Error(error.message);
    }
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    try {
        return await apiCall<Contact>(`/crm/contacts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    } catch (error: any) {
        console.error('Error updating contact:', error);
        throw new Error(error.message);
    }
}

export async function deleteContact(id: string): Promise<boolean> {
    try {
        console.log('[DELETE CONTACT] Deleting contact with ID:', id);
        if (!id || id === 'undefined') {
            throw new Error('Invalid contact ID');
        }
        await apiCall(`/crm/contacts/${id}`, { method: 'DELETE' });
        return true;
    } catch (error: any) {
        console.error('Error deleting contact:', error);
        throw new Error(error.message);
    }
}

// ==================== Deals ====================

export async function getDeals(): Promise<DealWithRelations[]> {
    try {
        return await apiCall<DealWithRelations[]>('/crm/deals');
    } catch (error) {
        console.error('Error fetching deals:', error);
        return [];
    }
}

export async function getDealById(id: string): Promise<DealWithRelations | null> {
    try {
        return await apiCall<DealWithRelations>(`/crm/deals/${id}`);
    } catch (error) {
        console.error('Error fetching deal:', error);
        return null;
    }
}

export async function getDealsByStage(stage: string): Promise<Deal[]> {
    try {
        return await apiCall<Deal[]>(`/crm/deals/stage/${stage}`);
    } catch (error) {
        console.error('Error fetching deals by stage:', error);
        return [];
    }
}

export async function createDeal(deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal | null> {
    try {
        return await apiCall<Deal>('/crm/deals', {
            method: 'POST',
            body: JSON.stringify(deal),
        });
    } catch (error: any) {
        console.error('Error creating deal:', error);
        throw new Error(error.message);
    }
}

export async function updateDeal(id: string, updates: Partial<Deal>): Promise<Deal | null> {
    try {
        return await apiCall<Deal>(`/crm/deals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    } catch (error: any) {
        console.error('Error updating deal:', error);
        throw new Error(error.message);
    }
}

export async function deleteDeal(id: string): Promise<boolean> {
    try {
        await apiCall(`/crm/deals/${id}`, { method: 'DELETE' });
        return true;
    } catch (error: any) {
        console.error('Error deleting deal:', error);
        throw new Error(error.message);
    }
}

// ==================== Activities ====================

export async function getActivities(filters?: {
    contactId?: string;
    companyId?: string;
    dealId?: string;
}): Promise<ActivityWithRelations[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.contactId) params.append('contactId', filters.contactId);
        if (filters?.companyId) params.append('companyId', filters.companyId);
        if (filters?.dealId) params.append('dealId', filters.dealId);

        const query = params.toString();
        return await apiCall<ActivityWithRelations[]>(`/crm/activities${query ? '?' + query : ''}`);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
    }
}

export async function createActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity | null> {
    try {
        return await apiCall<Activity>('/crm/activities', {
            method: 'POST',
            body: JSON.stringify(activity),
        });
    } catch (error: any) {
        console.error('Error creating activity:', error);
        throw new Error(error.message);
    }
}

export async function deleteActivity(id: string): Promise<boolean> {
    try {
        await apiCall(`/crm/activities/${id}`, { method: 'DELETE' });
        return true;
    } catch (error: any) {
        console.error('Error deleting activity:', error);
        throw new Error(error.message);
    }
}

// ==================== Tasks ====================

export async function getTasks(filters?: {
    contactId?: string;
    companyId?: string;
    dealId?: string;
    status?: string;
}): Promise<TaskWithRelations[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.contactId) params.append('contactId', filters.contactId);
        if (filters?.companyId) params.append('companyId', filters.companyId);
        if (filters?.dealId) params.append('dealId', filters.dealId);
        if (filters?.status) params.append('status', filters.status);

        const query = params.toString();
        return await apiCall<TaskWithRelations[]>(`/crm/tasks${query ? '?' + query : ''}`);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
    try {
        return await apiCall<Task>('/crm/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
        });
    } catch (error: any) {
        console.error('Error creating task:', error);
        throw new Error(error.message);
    }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
        return await apiCall<Task>(`/crm/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    } catch (error: any) {
        console.error('Error updating task:', error);
        throw new Error(error.message);
    }
}

export async function completeTask(id: string): Promise<Task | null> {
    try {
        return await apiCall<Task>(`/crm/tasks/${id}/complete`, {
            method: 'POST',
        });
    } catch (error: any) {
        console.error('Error completing task:', error);
        throw new Error(error.message);
    }
}

export async function deleteTask(id: string): Promise<boolean> {
    try {
        await apiCall(`/crm/tasks/${id}`, { method: 'DELETE' });
        return true;
    } catch (error: any) {
        console.error('Error deleting task:', error);
        throw new Error(error.message);
    }
}

// ==================== Dashboard Stats ====================

export async function getCRMStats() {
    try {
        return await apiCall('/crm/stats');
    } catch (error) {
        console.error('Error fetching CRM stats:', error);
        return {
            totalCompanies: 0,
            totalContacts: 0,
            totalDeals: 0,
            activeDeals: 0,
            wonDeals: 0,
            totalRevenue: 0,
            pipelineValue: 0,
            pendingTasks: 0,
        };
    }
}

