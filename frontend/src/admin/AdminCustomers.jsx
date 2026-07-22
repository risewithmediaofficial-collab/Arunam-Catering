import { useState, useEffect } from 'react';
import { getCustomers, saveCustomer, deleteCustomer } from './adminStore';
import { Plus, Search, Trash2, Edit2, UserPlus, Phone, MapPin, Mail } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const list = await getCustomers();
    setCustomers(list);
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setName(customer.name || '');
    setMobile(customer.mobile || '');
    setAddress(customer.address || '');
    setEmail(customer.email || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const ok = await deleteCustomer(id);
      if (ok) {
        loadCustomers();
        if (editingId === id) {
          clearForm();
        }
      }
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setName('');
    setMobile('');
    setAddress('');
    setEmail('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mobile) {
      alert('Please fill Name and Mobile fields.');
      return;
    }

    setSubmitting(true);
    const data = {
      name: name.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      email: email.trim()
    };

    if (editingId) {
      data._id = editingId;
    }

    const res = await saveCustomer(data);
    setSubmitting(false);
    if (res) {
      clearForm();
      loadCustomers();
      alert(editingId ? 'Customer updated successfully!' : 'Customer added successfully!');
    } else {
      alert('Failed to save customer.');
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile?.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-12 bg-[#fcfbfa]">
      {/* Top Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Customer Directory
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your client database for auto-filling manual billing details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Customers List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="admin-card p-4 bg-white border border-gray-200">
            {/* Search Bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search customers by name or mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full admin-input pl-9 py-2 text-sm"
              />
            </div>
          </div>

          <div className="admin-card bg-white border border-gray-200 overflow-hidden">
            {filteredCustomers.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                No customer records found. Add a customer on the right.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredCustomers.map((c) => (
                  <div key={c._id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-800 text-base">{c.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{c.mobile}</span>
                        </div>
                        {c.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{c.email}</span>
                          </div>
                        )}
                        {c.address && (
                          <div className="flex items-start gap-1.5 sm:col-span-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{c.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className="p-1.5 bg-gray-50 hover:bg-[#FF5C2B]/10 text-gray-500 hover:text-[#FF5C2B] rounded-lg border border-gray-200 hover:border-[#FF5C2B]/20 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c._id)}
                        className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg border border-gray-200 hover:border-red-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Create/Edit Form */}
        <div className="lg:col-span-1">
          <div className="admin-card p-4 sm:p-6 bg-white border border-gray-200 lg:sticky lg:top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#FF5C2B]" />
              {editingId ? 'Edit Customer' : 'Add New Customer'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 8148712345"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="admin-input py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                  Address
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. 24, Gandhi Nagar, Krishnagiri"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="admin-input py-2 text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 admin-btn-primary py-2 text-sm font-semibold cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Customer' : 'Add Customer'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="admin-btn-secondary py-2 text-sm font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
