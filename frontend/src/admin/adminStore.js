// ─────────────────────────────────────────────
//  Arunam Admin — Store/CRUD helpers (MongoDB API)
// ─────────────────────────────────────────────

const isDev = import.meta.env.DEV;
const API_URL = import.meta.env.VITE_API_URL || 
  (isDev 
    ? 'http://localhost:5000/api/bills' 
    : `${window.location.protocol}//${window.location.hostname}:5002/api/bills`);

/**
 * Fetch all bills sorted by updatedAt/createdAt desc from MongoDB server
 */
export async function getBills() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch bills');
    return await res.json();
  } catch (e) {
    console.error('Error reading bills from MongoDB backend:', e);
    return [];
  }
}

/**
 * Fetch a single bill by ID from MongoDB server
 */
export async function getBillById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch bill');
    }
    return await res.json();
  } catch (e) {
    console.error('Error reading bill by ID from MongoDB backend:', e);
    return null;
  }
}

/**
 * Save or update a bill in MongoDB server
 */
export async function saveBill(billData) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(billData),
    });
    if (!res.ok) throw new Error('Failed to save bill');
    return await res.json();
  } catch (e) {
    console.error('Error saving bill to MongoDB backend:', e);
    return null;
  }
}

/**
 * Delete a bill by ID in MongoDB server
 */
export async function deleteBill(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete bill');
    return true;
  } catch (e) {
    console.error('Error deleting bill from MongoDB backend:', e);
    return false;
  }
}

/**
 * Generate PDF filename helper
 */
export function getBillFilename(bill) {
  if (!bill) return 'invoice.pdf';
  const name = bill.customer?.name ? bill.customer.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'customer';
  const date = bill.eventDate ? bill.eventDate.split('T')[0] : 'date';
  return `Arunam_Bill_SNo_${bill.sno}_${name}_${date}.pdf`;
}

// ─────────────────────────────────────────────
// CUSTOMER API HELPERS (MongoDB API)
// ─────────────────────────────────────────────

const CUSTOMERS_API_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api/bills', '/api/customers')
  : (isDev 
      ? 'http://localhost:5000/api/customers' 
      : `${window.location.protocol}//${window.location.hostname}:5002/api/customers`);

const LOCAL_CUSTOMERS_KEY = 'arunam_customers_fallback';

/**
 * Fetch all customers sorted alphabetically from MongoDB server (or fallback)
 */
export async function getCustomers() {
  try {
    const res = await fetch(CUSTOMERS_API_URL);
    if (!res.ok) throw new Error('Failed to fetch customers');
    const apiCustomers = await res.json();
    
    // Also include any local fallback customers if any
    const stored = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    const localCustomers = stored ? JSON.parse(stored) : [];
    
    const apiIds = new Set(apiCustomers.map(c => c._id));
    const uniqueLocal = localCustomers.filter(c => !apiIds.has(c._id));
    return [...apiCustomers, ...uniqueLocal].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } catch (e) {
    console.error('Error reading customers from MongoDB backend, using fallback:', e);
    const stored = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

/**
 * Save or update a customer in MongoDB server (with local storage fallback)
 */
export async function saveCustomer(customerData) {
  try {
    // Clean payload to ensure empty _id is not sent
    const payload = { ...customerData };
    if (!payload._id || payload._id === '' || payload._id === 'null' || payload._id === 'undefined') {
      delete payload._id;
    }

    const res = await fetch(CUSTOMERS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Failed to save customer (${res.statusText})`);
    return await res.json();
  } catch (e) {
    console.error('Error saving customer to MongoDB backend, saving to local fallback:', e);
    try {
      const stored = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
      let localCustomers = stored ? JSON.parse(stored) : [];

      if (customerData._id) {
        localCustomers = localCustomers.map(c => c._id === customerData._id ? { ...c, ...customerData } : c);
      } else {
        const newCust = {
          ...customerData,
          _id: 'local_' + Date.now(),
          createdAt: new Date().toISOString()
        };
        delete newCust._id;
        newCust._id = 'local_' + Date.now();
        localCustomers.push(newCust);
        customerData = newCust;
      }
      localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(localCustomers));
      return customerData;
    } catch (fallbackErr) {
      console.error('LocalStorage fallback error:', fallbackErr);
      return null;
    }
  }
}

/**
 * Delete a customer by ID in MongoDB server
 */
export async function deleteCustomer(id) {
  try {
    if (id.startsWith('local_')) {
      const stored = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
      if (stored) {
        let localCustomers = JSON.parse(stored);
        localCustomers = localCustomers.filter(c => c._id !== id);
        localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(localCustomers));
      }
      return true;
    }

    const res = await fetch(`${CUSTOMERS_API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete customer');
    
    // Also remove from local fallback if present
    const stored = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    if (stored) {
      let localCustomers = JSON.parse(stored);
      localCustomers = localCustomers.filter(c => c._id !== id);
      localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(localCustomers));
    }
    return true;
  } catch (e) {
    console.error('Error deleting customer from MongoDB backend:', e);
    // Remove from local fallback
    const stored = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    if (stored) {
      let localCustomers = JSON.parse(stored);
      localCustomers = localCustomers.filter(c => c._id !== id);
      localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(localCustomers));
    }
    return true;
  }
}

