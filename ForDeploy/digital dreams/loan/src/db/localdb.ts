/**
 * Local Database using IndexedDB
 * This provides a MongoDB-like interface for local data storage
 */

const DB_NAME = 'DigitalDreemsDB';
const DB_VERSION = 2; // Incremented for EMI schedule

// Collection names
export const COLLECTIONS = {
  PROFILES: 'profiles',
  CUSTOMERS: 'customers',
  PRODUCTS: 'products',
  LOANS: 'loans',
  PAYMENTS: 'emi_payments',
  PENALTIES: 'penalties',
  GUARANTORS: 'guarantors',
  EMI_SCHEDULE: 'emi_schedule',
  FILES: 'files',
};

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create object stores (collections)
      if (!database.objectStoreNames.contains(COLLECTIONS.PROFILES)) {
        const profileStore = database.createObjectStore(COLLECTIONS.PROFILES, { keyPath: 'id' });
        profileStore.createIndex('email', 'email', { unique: true });
        profileStore.createIndex('role', 'role', { unique: false });
      }

      if (!database.objectStoreNames.contains(COLLECTIONS.CUSTOMERS)) {
        const customerStore = database.createObjectStore(COLLECTIONS.CUSTOMERS, { keyPath: 'id' });
        customerStore.createIndex('customer_code', 'customer_code', { unique: true });
        customerStore.createIndex('mobile_number', 'mobile_number', { unique: false });
        customerStore.createIndex('email', 'email', { unique: false });
      }

      if (!database.objectStoreNames.contains(COLLECTIONS.PRODUCTS)) {
        const productStore = database.createObjectStore(COLLECTIONS.PRODUCTS, { keyPath: 'id' });
        productStore.createIndex('product_code', 'product_code', { unique: true });
        productStore.createIndex('status', 'status', { unique: false });
      }

      if (!database.objectStoreNames.contains(COLLECTIONS.LOANS)) {
        const loanStore = database.createObjectStore(COLLECTIONS.LOANS, { keyPath: 'id' });
        loanStore.createIndex('loan_code', 'loan_code', { unique: true });
        loanStore.createIndex('customer_id', 'customer_id', { unique: false });
        loanStore.createIndex('status', 'status', { unique: false });
      }

      if (!database.objectStoreNames.contains(COLLECTIONS.PAYMENTS)) {
        const paymentStore = database.createObjectStore(COLLECTIONS.PAYMENTS, { keyPath: 'id' });
        paymentStore.createIndex('loan_id', 'loan_id', { unique: false });
        paymentStore.createIndex('payment_date', 'payment_date', { unique: false });
      }

      if (!database.objectStoreNames.contains(COLLECTIONS.PENALTIES)) {
        const penaltyStore = database.createObjectStore(COLLECTIONS.PENALTIES, { keyPath: 'id' });
        penaltyStore.createIndex('loan_id', 'loan_id', { unique: false });
      }

      if (!database.objectStoreNames.contains(COLLECTIONS.GUARANTORS)) {
        const guarantorStore = database.createObjectStore(COLLECTIONS.GUARANTORS, { keyPath: 'id' });
        guarantorStore.createIndex('loan_id', 'loan_id', { unique: false });
      }

      if (!database.objectStoreNames.contains(COLLECTIONS.EMI_SCHEDULE)) {
        const emiScheduleStore = database.createObjectStore(COLLECTIONS.EMI_SCHEDULE, { keyPath: 'id' });
        emiScheduleStore.createIndex('loan_id', 'loan_id', { unique: false });
        emiScheduleStore.createIndex('emi_number', 'emi_number', { unique: false });
        emiScheduleStore.createIndex('due_date', 'due_date', { unique: false });
        emiScheduleStore.createIndex('status', 'status', { unique: false });
      }

      if (!database.objectStoreNames.contains(COLLECTIONS.FILES)) {
        const fileStore = database.createObjectStore(COLLECTIONS.FILES, { keyPath: 'id' });
        fileStore.createIndex('entity_type', 'entity_type', { unique: false });
        fileStore.createIndex('entity_id', 'entity_id', { unique: false });
      }
    };
  });
}

/**
 * Generate UUID
 */
import { v4 as uuidv4 } from 'uuid';

function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof (crypto as any).randomUUID === 'function') {
      return (crypto as any).randomUUID();
    }
  } catch (e) {
    // ignore and fallback to uuid
  }

  return uuidv4();
}

/**
 * Insert a document
 */
export async function insertOne(collection: string, data: any): Promise<any> {
  const database = await initDB();
  const id = data.id || generateId();
  const timestamp = new Date().toISOString();
  
  const document = {
    ...data,
    id,
    created_at: data.created_at || timestamp,
    updated_at: timestamp,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([collection], 'readwrite');
    const store = transaction.objectStore(collection);
    const request = store.add(document);

    request.onsuccess = () => resolve(document);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Find documents
 */
export async function find(
  collection: string,
  query: any = {},
  options: { limit?: number; orderBy?: string; order?: 'asc' | 'desc' } = {}
): Promise<any[]> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([collection], 'readonly');
    const store = transaction.objectStore(collection);
    const request = store.getAll();

    request.onsuccess = () => {
      let results = request.result;

      // Apply filters
      if (Object.keys(query).length > 0) {
        results = results.filter((item) => {
          return Object.entries(query).every(([key, value]) => {
            if (value === null || value === undefined) return true;
            return item[key] === value;
          });
        });
      }

      // Apply sorting
      if (options.orderBy) {
        results.sort((a, b) => {
          const aVal = a[options.orderBy!];
          const bVal = b[options.orderBy!];
          const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          return options.order === 'desc' ? -comparison : comparison;
        });
      }

      // Apply limit
      if (options.limit) {
        results = results.slice(0, options.limit);
      }

      resolve(results);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Find one document
 */
export async function findOne(collection: string, query: any): Promise<any | null> {
  const results = await find(collection, query, { limit: 1 });
  return results.length > 0 ? results[0] : null;
}

/**
 * Find by ID
 */
export async function findById(collection: string, id: string): Promise<any | null> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([collection], 'readonly');
    const store = transaction.objectStore(collection);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update a document
 */
export async function updateOne(collection: string, id: string, data: any): Promise<any> {
  const database = await initDB();
  const existing = await findById(collection, id);

  if (!existing) {
    throw new Error('Document not found');
  }

  const updated = {
    ...existing,
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([collection], 'readwrite');
    const store = transaction.objectStore(collection);
    const request = store.put(updated);

    request.onsuccess = () => resolve(updated);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a document
 */
export async function deleteOne(collection: string, id: string): Promise<boolean> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([collection], 'readwrite');
    const store = transaction.objectStore(collection);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Count documents
 */
export async function count(collection: string, query: any = {}): Promise<number> {
  const results = await find(collection, query);
  return results.length;
}

/**
 * Get next sequence number for code generation
 */
export async function getNextSequence(collection: string, prefix: string): Promise<string> {
  const results = await find(collection, {}, { orderBy: 'created_at', order: 'desc', limit: 1 });
  
  if (results.length === 0) {
    return `${prefix}000001`;
  }

  const lastCode = results[0][`${collection.slice(0, -1)}_code`] || `${prefix}000000`;
  const lastNumber = parseInt(lastCode.replace(prefix, ''), 10);
  const nextNumber = lastNumber + 1;
  
  return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
}

/**
 * Store file
 */
export async function storeFile(file: File, entityType: string, entityId: string, fieldName: string): Promise<string> {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const fileData = {
          entity_type: entityType,
          entity_id: entityId,
          field_name: fieldName,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_data: reader.result as string,
        };

        const stored = await insertOne(COLLECTIONS.FILES, fileData);
        resolve(stored.id);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Get file
 */
export async function getFile(fileId: string): Promise<string | null> {
  const file = await findById(COLLECTIONS.FILES, fileId);
  return file ? file.file_data : null;
}

/**
 * Get files by entity
 */
export async function getFilesByEntity(entityType: string, entityId: string): Promise<any[]> {
  return find(COLLECTIONS.FILES, { entity_type: entityType, entity_id: entityId });
}

/**
 * Clear all data (for testing)
 */
export async function clearAllData(): Promise<void> {
  const database = await initDB();
  const collections = Object.values(COLLECTIONS);

  for (const collection of collections) {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction([collection], 'readwrite');
      const store = transaction.objectStore(collection);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Export all data
 */
export async function exportAllData(): Promise<any> {
  const database = await initDB();
  const collections = Object.values(COLLECTIONS);
  const exportData: any = {};

  for (const collection of collections) {
    exportData[collection] = await find(collection);
  }

  return exportData;
}

/**
 * Import data
 */
export async function importData(data: any): Promise<void> {
  const database = await initDB();

  for (const [collection, documents] of Object.entries(data)) {
    if (!Array.isArray(documents)) continue;

    for (const doc of documents) {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction([collection], 'readwrite');
        const store = transaction.objectStore(collection);
        const request = store.put(doc);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
}
