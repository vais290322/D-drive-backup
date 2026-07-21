/**
 * CRM API Layer for Supabase
 * Handles all CRM-related database operations
 */

import { supabase } from './supabase';
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

// ==================== Companies ====================

export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }

  return data;
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating company:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating company:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCompany(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting company:', error);
    throw new Error(error.message);
  }

  return true;
}

// ==================== Contacts ====================

export async function getContacts(): Promise<ContactWithCompany[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      company:companies(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function getContactById(id: string): Promise<ContactWithCompany | null> {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching contact:', error);
    return null;
  }

  return data;
}

export async function getContactsByCompany(companyId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts by company:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating contact:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating contact:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteContact(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    throw new Error(error.message);
  }

  return true;
}

// ==================== Deals ====================

export async function getDeals(): Promise<DealWithRelations[]> {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      company:companies(*),
      contact:contacts(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching deals:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function getDealById(id: string): Promise<DealWithRelations | null> {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      company:companies(*),
      contact:contacts(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching deal:', error);
    return null;
  }

  return data;
}

export async function getDealsByStage(stage: string): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('stage', stage)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching deals by stage:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function createDeal(deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal | null> {
  const { data, error } = await supabase
    .from('deals')
    .insert([deal])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating deal:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateDeal(id: string, updates: Partial<Deal>): Promise<Deal | null> {
  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating deal:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteDeal(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting deal:', error);
    throw new Error(error.message);
  }

  return true;
}

// ==================== Activities ====================

export async function getActivities(filters?: {
  contactId?: string;
  companyId?: string;
  dealId?: string;
}): Promise<ActivityWithRelations[]> {
  let query = supabase
    .from('activities')
    .select(`
      *,
      contact:contacts(*),
      company:companies(*),
      deal:deals(*)
    `);

  if (filters?.contactId) {
    query = query.eq('contact_id', filters.contactId);
  }
  if (filters?.companyId) {
    query = query.eq('company_id', filters.companyId);
  }
  if (filters?.dealId) {
    query = query.eq('deal_id', filters.dealId);
  }

  const { data, error } = await query.order('activity_date', { ascending: false });

  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function createActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .insert([activity])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating activity:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteActivity(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting activity:', error);
    throw new Error(error.message);
  }

  return true;
}

// ==================== Tasks ====================

export async function getTasks(filters?: {
  contactId?: string;
  companyId?: string;
  dealId?: string;
  status?: string;
}): Promise<TaskWithRelations[]> {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      contact:contacts(*),
      company:companies(*),
      deal:deals(*)
    `);

  if (filters?.contactId) {
    query = query.eq('contact_id', filters.contactId);
  }
  if (filters?.companyId) {
    query = query.eq('company_id', filters.companyId);
  }
  if (filters?.dealId) {
    query = query.eq('deal_id', filters.dealId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating task:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function completeTask(id: string): Promise<Task | null> {
  return updateTask(id, {
    status: 'completed',
    completed_at: new Date().toISOString(),
  });
}

export async function deleteTask(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error(error.message);
  }

  return true;
}

// ==================== Dashboard Stats ====================

export async function getCRMStats() {
  const [companies, contacts, deals, tasks] = await Promise.all([
    getCompanies(),
    getContacts(),
    getDeals(),
    getTasks({ status: 'pending' }),
  ]);

  const totalRevenue = deals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + Number(d.value), 0);

  const pipelineValue = deals
    .filter(d => !['won', 'lost'].includes(d.stage))
    .reduce((sum, d) => sum + Number(d.value), 0);

  const activeDeals = deals.filter(d => !['won', 'lost'].includes(d.stage)).length;
  const wonDeals = deals.filter(d => d.stage === 'won').length;

  return {
    totalCompanies: companies.length,
    totalContacts: contacts.length,
    totalDeals: deals.length,
    activeDeals,
    wonDeals,
    totalRevenue,
    pipelineValue,
    pendingTasks: tasks.length,
  };
}
