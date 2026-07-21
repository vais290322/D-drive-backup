/**
 * Settings API for MongoDB Backend
 */

import type { BusinessSettings } from '@/types/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const SERVER_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:4000';
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

/**
 * Get business settings
 */
export async function getBusinessSettings(): Promise<BusinessSettings | null> {
    try {
        const settings = await apiCall<BusinessSettings>('/settings');

        // Convert relative logo URL to absolute URL
        if (settings && settings.logo_url && !settings.logo_url.startsWith('http')) {
            settings.logo_url = `${SERVER_BASE}${settings.logo_url}`;
        }

        return settings;
    } catch (error) {
        console.error('Error fetching business settings:', error);
        return null;
    }
}

/**
 * Update business settings
 */
export async function updateBusinessSettings(
    settings: Partial<BusinessSettings>
): Promise<BusinessSettings> {
    const result = await apiCall<BusinessSettings>('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
    });

    // Convert relative logo URL to absolute URL
    if (result && result.logo_url && !result.logo_url.startsWith('http')) {
        result.logo_url = `${SERVER_BASE}${result.logo_url}`;
    }

    return result;
}

/**
 * Upload logo file
 */
export async function uploadLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('File upload failed');
    }

    const result = await response.json();
    const logoUrl = result.url || result.fileUrl;

    // Return absolute URL
    return logoUrl.startsWith('http') ? logoUrl : `${SERVER_BASE}${logoUrl}`;
}

/**
 * Delete logo
 */
export async function deleteLogo(logoUrl: string): Promise<void> {
    // Extract filename from URL
    const filename = logoUrl.split('/').pop();
    if (!filename) return;

    try {
        await apiCall(`/upload/${filename}`, { method: 'DELETE' });
    } catch (error) {
        console.warn('Logo deletion failed:', error);
    }
}


