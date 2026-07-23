import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Printer, Search, Calendar, Users, DollarSign,
  ReceiptText, CreditCard, AlertCircle, RefreshCw, Filter, ArrowUpRight, TrendingUp,
  Briefcase, PieChart, ChevronDown
} from 'lucide-react';
import { getBills, deleteBill } from './adminStore';
import './admin.css';

export default function AdminDashboard() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Date Filter State
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'this_month' | 'last_month' | 'this_year' | 'custom'
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    setLoading(true);
    try {
      const list = await getBills();
      setBills(Array.isArray(list) ? list : []);
    } catch {
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill permanently?')) {
      await deleteBill(id);
      await loadBills();
    }
  };

  // Quick preset handler for Date Filters
  const handlePresetChange = (preset) => {
    setDateFilter(preset);
    const now = new Date();

    if (preset === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setFromDate(firstDay.toISOString().split('T')[0]);
      setToDate(lastDay.toISOString().split('T')[0]);
    } else if (preset === 'last_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      setFromDate(firstDay.toISOString().split('T')[0]);
      setToDate(lastDay.toISOString().split('T')[0]);
    } else if (preset === 'this_year') {
      const firstDay = new Date(now.getFullYear(), 0, 1);
      const lastDay = new Date(now.getFullYear(), 11, 31);
      setFromDate(firstDay.toISOString().split('T')[0]);
      setToDate(lastDay.toISOString().split('T')[0]);
    } else if (preset === 'all') {
      setFromDate('');
      setToDate('');
    }
  };

  // 1. Filter bills based on Date Range
  const dateFilteredBills = useMemo(() => {
    if (!fromDate && !toDate) return bills;

    return bills.filter((b) => {
      const rawDate = b.eventDate || b.createdAt;
      if (!rawDate) return true;
      const bDateStr = new Date(rawDate).toISOString().split('T')[0];

      if (fromDate && bDateStr < fromDate) return false;
      if (toDate && bDateStr > toDate) return false;
      return true;
    });
  }, [bills, fromDate, toDate]);

  // 2. Filter bills based on Search Term
  const finalFilteredBills = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return dateFilteredBills;

    return dateFilteredBills.filter(
      (b) =>
        b.customer?.name?.toLowerCase().includes(term) ||
        b.customer?.mobile?.includes(term) ||
        b.sno?.toString().includes(term) ||
        b.functionType?.toLowerCase().includes(term)
    );
  }, [dateFilteredBills, search]);

  // Financial & Operational Metrics (Calculated on dateFilteredBills)
  const metrics = useMemo(() => {
    let totalSales = 0;
    let totalAdvance = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalExtraExpenses = 0;

    let bPlates = 0;
    let lPlates = 0;
    let dPlates = 0;

    const functionTypeCounts = {};

    dateFilteredBills.forEach((b) => {
      const grandTotal = Number(b.grandTotal) || 0;
      const advance = Number(b.advancePaid) || 0;
      const paid = Number(b.amountPaid) || 0;
      const pending = Number(b.balancePending) || Math.max(0, grandTotal - advance - paid);

      totalSales += grandTotal;
      totalAdvance += advance;
      totalPaid += paid;
      totalPending += pending;

      // Calculate extra charges expenses
      if (Array.isArray(b.extraCharges)) {
        b.extraCharges.forEach((ex) => {
          totalExtraExpenses += Number(ex.amount || ex.cost || ex.price || 0);
        });
      }

      // Plates count
      bPlates += Number(b.breakfastPeople) || 0;
      lPlates += Number(b.lunchPeople) || 0;
      dPlates += Number(b.dinnerPeople) || 0;

      // Function types distribution
      const fnType = b.functionType || 'General Function';
      functionTypeCounts[fnType] = (functionTypeCounts[fnType] || 0) + 1;
    });

    const totalCollected = totalAdvance + totalPaid;
    const totalPlates = bPlates + lPlates + dPlates;
    const paidCount = dateFilteredBills.filter((b) => b.status === 'Paid').length;

    return {
      totalSales,
      totalAdvance,
      totalPaid,
      totalCollected,
      totalPending,
      totalExtraExpenses,
      totalPlates,
      bPlates,
      lPlates,
      dPlates,
      paidCount,
      totalCount: dateFilteredBills.length,
      functionTypeCounts,
    };
  }, [dateFilteredBills]);

  return (
    <div className="space-y-8">
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Admin Dashboard
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Real-time financial overview, catering budget analytics, and past order archives.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadBills}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-black hover:border-gray-300 transition-all shadow-xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <Link
            to="/admin/bill/new"
            className="admin-btn-primary flex items-center justify-center gap-2 cursor-pointer text-xs md:text-sm py-2.5 px-5"
          >
            <Plus size={16} />
            Create Catering Bill
          </Link>
        </div>
      </div>

      {/* Date & Past Data Calendar Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF5C2B]/10 text-[#FF5C2B] flex items-center justify-center">
              <Calendar size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Past Data & Date Filter</h3>
              <p className="text-[11px] text-gray-500">Filter sales budget and orders by custom calendar dates</p>
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'this_year', label: 'This Year' },
              { id: 'custom', label: 'Custom Calendar' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  dateFilter === p.id
                    ? 'bg-[#FF5C2B] text-white border-[#FF5C2B] shadow-xs'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Calendar Inputs */}
        {(dateFilter === 'custom' || fromDate || toDate) && (
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50/60 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600">From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setDateFilter('custom');
                }}
                className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800 focus:outline-none focus:border-[#FF5C2B]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600">To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setDateFilter('custom');
                }}
                className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800 focus:outline-none focus:border-[#FF5C2B]"
              />
            </div>

            {(fromDate || toDate) && (
              <button
                onClick={() => handlePresetChange('all')}
                className="text-xs text-red-500 font-semibold hover:underline ml-auto"
              >
                Reset Date Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Financial & Operational KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {/* Total Budget / Sales */}
        <div className="admin-card p-5 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Budget / Sales</p>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C2B] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900">₹{metrics.totalSales.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-gray-400 mt-1 font-medium">{metrics.totalCount} Total Bill(s)</p>
        </div>

        {/* Payments Collected */}
        <div className="admin-card p-5 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Collected</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-emerald-700">₹{metrics.totalCollected.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-emerald-600 mt-1 font-medium">Advance + Received</p>
        </div>

        {/* Pending Balance */}
        <div className="admin-card p-5 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Balance</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-amber-700">₹{metrics.totalPending.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-amber-600 mt-1 font-medium">Outstanding Amounts</p>
        </div>

        {/* Extra Expenses / Charges */}
        <div className="admin-card p-5 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Extra Expenses</p>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-purple-700">₹{metrics.totalExtraExpenses.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-purple-600 mt-1 font-medium">Itemized Add-ons</p>
        </div>

        {/* Total Plates Served */}
        <div className="admin-card p-5 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Total Plates</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-blue-700">{metrics.totalPlates.toLocaleString()}</p>
          <p className="text-[10px] text-blue-600 mt-1 font-medium">B:{metrics.bPlates} L:{metrics.lPlates} D:{metrics.dPlates}</p>
        </div>

        {/* Paid Invoices Ratio */}
        <div className="admin-card p-5 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Paid Status</p>
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
              <ReceiptText size={16} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900">{metrics.paidCount} / {metrics.totalCount}</p>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">
            {metrics.totalCount > 0 ? `${Math.round((metrics.paidCount / metrics.totalCount) * 100)}% Cleared` : '0% Cleared'}
          </p>
        </div>
      </div>

      {/* Financial Balance Progress & Function Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Progress & Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <PieChart size={18} className="text-[#FF5C2B]" /> Revenue & Budget Recovery Overview
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {dateFilter === 'all' ? 'All Time Overview' : `Filtered: ${dateFilteredBills.length} Bill(s)`}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700">Collected: ₹{metrics.totalCollected.toLocaleString('en-IN')}</span>
                <span className="text-amber-700">Pending: ₹{metrics.totalPending.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalSales > 0 ? (metrics.totalCollected / metrics.totalSales) * 100 : 0}%`
                  }}
                  title="Collected"
                />
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalSales > 0 ? (metrics.totalPending / metrics.totalSales) * 100 : 0}%`
                  }}
                  title="Pending Balance"
                />
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Advance Received</p>
                <p className="text-base font-bold text-emerald-900 mt-1">₹{metrics.totalAdvance.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <p className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Final Payments</p>
                <p className="text-base font-bold text-blue-900 mt-1">₹{metrics.totalPaid.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <p className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Extra Add-ons Expense</p>
                <p className="text-base font-bold text-purple-900 mt-1">₹{metrics.totalExtraExpenses.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Function Type Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-[#FF5C2B]" /> Function Types Distribution
          </h3>

          <div className="space-y-3">
            {Object.keys(metrics.functionTypeCounts).length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No functions in selected range.</p>
            ) : (
              Object.entries(metrics.functionTypeCounts).map(([fnType, count]) => {
                const pct = metrics.totalCount > 0 ? Math.round((count / metrics.totalCount) * 100) : 0;
                return (
                  <div key={fnType} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800">{fnType}</span>
                      <span className="font-bold text-[#FF5C2B]">{count} event(s) ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-[#FF5C2B] h-full transition-all duration-300" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bill List Card */}
      <div className="admin-card overflow-hidden bg-white border border-gray-200 shadow-sm">
        {/* Table Top Bar */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-800">Catering Bills Archive</h2>
            <p className="text-xs text-gray-400 mt-0.5">Showing {finalFilteredBills.length} of {bills.length} total bills</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name, Mobile, S.No or Function..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5C2B]"
            />
          </div>
        </div>

        {finalFilteredBills.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <ReceiptText className="w-12 h-12 mx-auto text-gray-300" />
            <p className="font-semibold text-base text-gray-600">No bills found in selected period</p>
            <p className="text-xs text-gray-400">Try adjusting your calendar date filters or search terms.</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards (hidden on md+) */}
            <div className="md:hidden divide-y divide-gray-100">
              {finalFilteredBills.map((b) => {
                const grandTotal = Number(b.grandTotal) || 0;
                const advance = Number(b.advancePaid) || 0;
                const paid = Number(b.amountPaid) || 0;
                const pending = Number(b.balancePending) || Math.max(0, grandTotal - advance - paid);

                return (
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
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">₹{grandTotal.toLocaleString('en-IN')}</span>
                        {pending > 0 && <span className="text-amber-600 ml-2 font-medium">(Pending: ₹{pending.toLocaleString('en-IN')})</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/bill/${b.id}/print`} className="p-2 bg-gray-100 hover:bg-[#FF5C2B]/10 text-gray-600 hover:text-[#FF5C2B] rounded-lg transition-all">
                          <Printer size={14} />
                        </Link>
                        <Link to={`/admin/bill/edit/${b.id}`} className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-all">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(b.id)} className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-lg transition-all cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 px-6">S.No</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Event Date</th>
                    <th className="py-4 px-6">Function Type</th>
                    <th className="py-4 px-6 text-right">Budget (Grand Total)</th>
                    <th className="py-4 px-6 text-right">Adv / Paid</th>
                    <th className="py-4 px-6 text-right">Pending</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-sm">
                  {finalFilteredBills.map((b) => {
                    const grandTotal = Number(b.grandTotal) || 0;
                    const advance = Number(b.advancePaid) || 0;
                    const paid = Number(b.amountPaid) || 0;
                    const pending = Number(b.balancePending) || Math.max(0, grandTotal - advance - paid);

                    return (
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
                        <td className="py-4 px-6 text-right font-bold text-gray-900">₹{grandTotal.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-6 text-right text-emerald-700 font-semibold text-xs">
                          ₹{(advance + paid).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 text-right font-semibold text-xs text-amber-700">
                          {pending > 0 ? `₹${pending.toLocaleString('en-IN')}` : '₹0'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${b.status === 'Paid' ? 'bg-green-100 text-green-700 border border-green-200' : b.status === 'Sent' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                            {b.status || 'Draft'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2.5">
                            <Link to={`/admin/bill/${b.id}/print`} title="Print / View Invoice" className="p-2 bg-gray-100 hover:bg-[#FF5C2B]/10 text-gray-600 hover:text-[#FF5C2B] rounded-lg transition-all">
                              <Printer size={14} />
                            </Link>
                            <Link to={`/admin/bill/edit/${b.id}`} title="Edit Bill" className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-all">
                              <Edit2 size={14} />
                            </Link>
                            <button onClick={() => handleDelete(b.id)} title="Delete Bill" className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-lg transition-all cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
