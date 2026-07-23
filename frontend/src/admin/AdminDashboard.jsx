import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Printer, Search, Calendar, Users, DollarSign, ReceiptText } from 'lucide-react';
import { getBills, deleteBill } from './adminStore';
import './admin.css';

export default function AdminDashboard() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredBills, setFilteredBills] = useState([]);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    const list = await getBills();
    setBills(list);
    setFilteredBills(list);
  };

  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (!term) {
      setFilteredBills(bills);
    } else {
      const filtered = bills.filter(
        (b) =>
          b.customer?.name?.toLowerCase().includes(term) ||
          b.customer?.mobile?.includes(term) ||
          b.sno.toString().includes(term)
      );
      setFilteredBills(filtered);
    }
  }, [search, bills]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill permanently?')) {
      await deleteBill(id);
      await loadBills();
    }
  };

  // Metrics
  const totalRevenue = bills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalCount = bills.length;

  // Calculate total plates count across all breakfast, lunch, and dinner bookings
  const totalBreakfastPlates = bills.reduce((sum, b) => sum + (Number(b.breakfastPeople) || 0), 0);
  const totalLunchPlates = bills.reduce((sum, b) => sum + (Number(b.lunchPeople) || 0), 0);
  const totalDinnerPlates = bills.reduce((sum, b) => sum + (Number(b.dinnerPeople) || 0), 0);
  const totalPlatesCount = totalBreakfastPlates + totalLunchPlates + totalDinnerPlates;

  const paidBillsCount = bills.filter((b) => b.status === 'Paid').length;

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage, edit, and print customer catering orders</p>
        </div>
        <Link
          to="/admin/bill/new"
          className="admin-btn-primary flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-xs sm:text-sm py-2.5"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Create Catering Bill
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="admin-card p-6 flex items-center gap-4 bg-white border border-gray-200">
          <div className="w-12 h-12 rounded-lg bg-[#FF5C2B]/10 text-[#FF5C2B] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Sales</p>
            <p className="text-xl font-bold text-gray-800 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="admin-card p-6 flex items-center gap-4 bg-white border border-gray-200">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <ReceiptText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Bills</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{totalCount}</p>
          </div>
        </div>

        <div className="admin-card p-6 flex items-center gap-4 bg-white border border-gray-200">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Plates Served</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{totalPlatesCount.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-card p-6 flex items-center gap-4 bg-white border border-gray-200">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Paid Invoices</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{paidBillsCount} / {totalCount}</p>
          </div>
        </div>
      </div>

      {/* Bill List Card */}
      <div className="admin-card overflow-hidden bg-white border border-gray-200 shadow-sm">
        {/* Table Top Bar */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base md:text-lg font-bold text-gray-800">Recent Catering Bills</h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name, Mob or S.No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5C2B]"
            />
          </div>
        </div>

        {filteredBills.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <ReceiptText className="w-12 h-12 mx-auto text-gray-300" />
            <p className="font-semibold text-base text-gray-600">No bills found</p>
            <p className="text-xs text-gray-400">Create a new manual bill to get started.</p>
          </div>
        ) : (
          <>
            {/* Mobile cards (hidden on md+) */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredBills.map((b) => (
                <div key={b.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">#{b.sno} — {b.customer?.name}</p>
                      <p className="text-xs text-gray-500">{b.customer?.mobile}</p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${b.status === 'Paid' ? 'bg-green-100 text-green-700' : b.status === 'Sent' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {b.status || 'Draft'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>📅 {b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FF5C2B]/10 text-[#FF5C2B] font-semibold">{b.functionType || 'General'}</span>
                    <span>B:{b.breakfastPeople||0} L:{b.lunchPeople||0} D:{b.dinnerPeople||0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">₹{(b.grandTotal || 0).toLocaleString('en-IN')}</span>
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/bill/${b.id}/print`} className="p-2 bg-gray-100 hover:bg-[#FF5C2B]/10 text-gray-600 hover:text-[#FF5C2B] rounded-lg transition-all">
                        <Printer className="w-4 h-4" />
                      </Link>
                      <Link to={`/admin/bill/edit/${b.id}`} className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(b.id)} className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-lg transition-all cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table (hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 px-6">S.No</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Event Date</th>
                    <th className="py-4 px-6">Function Type</th>
                    <th className="py-4 px-6 text-right">Plates B &amp; L &amp; D</th>
                    <th className="py-4 px-6 text-right">Total Amount</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-sm">
                  {filteredBills.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors duration-150 text-gray-700">
                      <td className="py-4 px-6 font-bold text-gray-900">#{b.sno}</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">{b.customer?.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{b.customer?.mobile}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FF5C2B]/10 text-[#FF5C2B]">
                          {b.functionType || 'General Function'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-gray-600">
                        B: {b.breakfastPeople || 0} | L: {b.lunchPeople || 0} | D: {b.dinnerPeople || 0}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900">₹{(b.grandTotal || 0).toLocaleString('en-IN')}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${b.status === 'Paid' ? 'bg-green-100 text-green-700 border border-green-200' : b.status === 'Sent' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                          {b.status || 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link to={`/admin/bill/${b.id}/print`} title="Print / View Invoice" className="p-2 bg-gray-100 hover:bg-[#FF5C2B]/10 text-gray-600 hover:text-[#FF5C2B] rounded-lg transition-all">
                            <Printer className="w-4 h-4" />
                          </Link>
                          <Link to={`/admin/bill/edit/${b.id}`} title="Edit Bill" className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-all">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(b.id)} title="Delete Bill" className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-lg transition-all cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
