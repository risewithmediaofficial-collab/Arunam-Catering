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

const CUSTOMERS_API_URL = isDev
  ? 'http://localhost:5000/api/customers'
  : `${window.location.protocol}//${window.location.hostname}:5002/api/customers`;

/**
 * Fetch all customers sorted alphabetically from MongoDB server
 */
export async function getCustomers() {
  try {
    const res = await fetch(CUSTOMERS_API_URL);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return await res.json();
  } catch (e) {
    console.error('Error reading customers from MongoDB backend:', e);
    return [];
  }
}

/**
 * Save or update a customer in MongoDB server
 */
export async function saveCustomer(customerData) {
  try {
    const res = await fetch(CUSTOMERS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!res.ok) throw new Error('Failed to save customer');
    return await res.json();
  } catch (e) {
    console.error('Error saving customer to MongoDB backend:', e);
    return null;
  }
}

/**
 * Delete a customer by ID in MongoDB server
 */
export async function deleteCustomer(id) {
  try {
    const res = await fetch(`${CUSTOMERS_API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete customer');
    return true;
  } catch (e) {
    console.error('Error deleting customer from MongoDB backend:', e);
    return false;
  }
}
