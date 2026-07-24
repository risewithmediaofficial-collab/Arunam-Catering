// ─────────────────────────────────────────────
//  Arunam Admin — Store/CRUD helpers (MongoDB API + localStorage fallback)
// ─────────────────────────────────────────────

import { API_BASE_URL as BASE_API } from '../config/api';

const BILLS_API     = `${BASE_API}/api/bills`;
const CUSTOMERS_API = `${BASE_API}/api/customers`;
const ENQUIRIES_API = `${BASE_API}/api/enquiries`;

// localStorage fallback keys
const LOCAL_BILLS_KEY     = 'arunam_bills_fallback';
const LOCAL_CUSTOMERS_KEY = 'arunam_customers_fallback';

// ─────────────────────── BILLS ───────────────────────

function localGetBills() {
  try {
    const stored = localStorage.getItem(LOCAL_BILLS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function localSaveBills(bills) {
  try { localStorage.setItem(LOCAL_BILLS_KEY, JSON.stringify(bills)); } catch {}
}

/**
 * Fetch all bills (MongoDB → local fallback)
 */
export async function getBills() {
  try {
    const res = await fetch(BILLS_API);
    if (!res.ok) throw new Error('Server error: ' + res.status);
    const bills = await res.json();
    localSaveBills(bills); // keep local cache in sync
    return bills;
  } catch (e) {
    console.warn('Bills: backend unavailable, using localStorage cache:', e.message);
    return localGetBills().sort((a, b) => (b.sno || 0) - (a.sno || 0));
  }
}

/**
 * Fetch a single bill by UUID id
 */
export async function getBillById(id) {
  try {
    const res = await fetch(`${BILLS_API}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Server error: ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('getBillById: backend unavailable, checking local cache:', e.message);
    const bills = localGetBills();
    return bills.find(b => String(b.id) === String(id) || String(b.sno) === String(id) || String(b._id) === String(id)) || null;
  }
}

/**
 * Save or update a bill (MongoDB → localStorage fallback)
 */
export async function saveBill(billData) {
  try {
    const res = await fetch(BILLS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData),
    });
    if (!res.ok) throw new Error('Server error: ' + res.status);
    const saved = await res.json();

    // Keep local cache updated
    const bills = localGetBills();
    const idx = bills.findIndex(b => b.id === saved.id);
    if (idx >= 0) bills[idx] = saved; else bills.unshift(saved);
    localSaveBills(bills);

    return saved;
  } catch (e) {
    console.warn('saveBill: backend unavailable, saving to localStorage:', e.message);

    // ── Local fallback save ──
    const bills = localGetBills();
    let bill;

    if (billData.id) {
      const idx = bills.findIndex(b => b.id === billData.id);
      if (idx >= 0) {
        bills[idx] = { ...bills[idx], ...billData, updatedAt: new Date().toISOString() };
        bill = bills[idx];
      }
    }

    if (!bill) {
      // assign sno
      const maxSno = bills.reduce((m, b) => Math.max(m, b.sno || 0), 0);
      bill = {
        ...billData,
        id: billData.id || crypto.randomUUID(),
        sno: billData.sno || maxSno + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      bills.unshift(bill);
    }

    localSaveBills(bills);
    return bill;
  }
}

/**
 * Delete a bill by UUID id
 */
export async function deleteBill(id) {
  try {
    const res = await fetch(`${BILLS_API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Server error: ' + res.status);

    // Remove from local cache too
    const bills = localGetBills().filter(b => b.id !== id);
    localSaveBills(bills);
    return true;
  } catch (e) {
    console.warn('deleteBill: backend unavailable, deleting from localStorage:', e.message);
    const bills = localGetBills().filter(b => b.id !== id);
    localSaveBills(bills);
    return true;
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

// ─────────────────────── CUSTOMERS ───────────────────────

function localGetCustomers() {
  try {
    const stored = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function localSaveCustomers(customers) {
  try { localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(customers)); } catch {}
}

/**
 * Fetch all customers (MongoDB → localStorage fallback)
 */
export async function getCustomers() {
  try {
    const res = await fetch(CUSTOMERS_API);
    if (!res.ok) throw new Error('Server error: ' + res.status);
    const apiCustomers = await res.json();

    // Merge with any local-only entries
    const localCustomers = localGetCustomers();
    const apiIds = new Set(apiCustomers.map(c => c._id));
    const uniqueLocal = localCustomers.filter(c => !apiIds.has(c._id));
    const merged = [...apiCustomers, ...uniqueLocal].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    localSaveCustomers(merged);
    return merged;
  } catch (e) {
    console.warn('Customers: backend unavailable, using localStorage cache:', e.message);
    return localGetCustomers().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }
}

/**
 * Save or update a customer (MongoDB → localStorage fallback)
 */
export async function saveCustomer(customerData) {
  try {
    const payload = { ...customerData };
    if (!payload._id || ['', 'null', 'undefined'].includes(String(payload._id))) {
      delete payload._id;
    }

    const res = await fetch(CUSTOMERS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
    const saved = await res.json();

    // Update local cache
    const customers = localGetCustomers();
    const idx = customers.findIndex(c => c._id === saved._id);
    if (idx >= 0) customers[idx] = saved; else customers.push(saved);
    localSaveCustomers(customers);

    return saved;
  } catch (e) {
    console.warn('saveCustomer: backend unavailable, saving to localStorage:', e.message);

    const customers = localGetCustomers();
    let customer;

    if (customerData._id) {
      const idx = customers.findIndex(c => c._id === customerData._id);
      if (idx >= 0) {
        customers[idx] = { ...customers[idx], ...customerData };
        customer = customers[idx];
      }
    }

    if (!customer) {
      customer = {
        ...customerData,
        _id: 'local_' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      delete customer._id;
      customer._id = 'local_' + Date.now();
      customers.push(customer);
    }

    localSaveCustomers(customers);
    return customer;
  }
}

/**
 * Delete a customer by ID (supports local_ prefix)
 */
export async function deleteCustomer(id) {
  try {
    if (String(id).startsWith('local_')) {
      const customers = localGetCustomers().filter(c => c._id !== id);
      localSaveCustomers(customers);
      return true;
    }

    const res = await fetch(`${CUSTOMERS_API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Server error: ' + res.status);

    const customers = localGetCustomers().filter(c => c._id !== id);
    localSaveCustomers(customers);
    return true;
  } catch (e) {
    console.warn('deleteCustomer: error, removing from localStorage:', e.message);
    const customers = localGetCustomers().filter(c => c._id !== id);
    localSaveCustomers(customers);
    return true;
  }
}

// ─────────────────────── ENQUIRIES ───────────────────────

export async function getEnquiries() {
  try {
    const res = await fetch(ENQUIRIES_API);
    if (!res.ok) throw new Error('Server error: ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('Enquiries: backend unavailable:', e.message);
    return [];
  }
}
