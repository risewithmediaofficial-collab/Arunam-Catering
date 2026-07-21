import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBillById } from './adminStore';
import {
  ArrowLeft,
  Printer,
  MapPin,
  Phone,
  Mail,
  Globe,
  Utensils,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Building2
} from 'lucide-react';
import './admin.css';

export default function BillPrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    async function loadBill() {
      const existing = await getBillById(id);
      if (existing) {
        setBill(existing);
      } else {
        alert('Invoice details not found!');
        navigate('/admin');
      }
    }
    loadBill();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (!bill) {
    return (
      <div className="admin-body min-h-screen flex items-center justify-center p-6 bg-[#fcfbfa]">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-10 h-10 border-4 border-[#FF5C2B]/30 border-t-[#FF5C2B] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Loading Invoice...</p>
        </div>
      </div>
    );
  }

  // Calculate plate counts totals & sessions
  const sessionsList = [];
  if (bill.hasBreakfast) sessionsList.push({ name: 'Breakfast', plates: bill.breakfastPeople, rate: bill.breakfastRate });
  if (bill.hasLunch) sessionsList.push({ name: 'Lunch', plates: bill.lunchPeople, rate: bill.lunchRate });
  if (bill.hasDinner) sessionsList.push({ name: 'Dinner', plates: bill.dinnerPeople, rate: bill.dinnerRate });

  // Calculate S.No sequences
  let itemCounter = 1;
  const bfSno = bill.hasBreakfast ? itemCounter++ : 0;
  const lnSno = bill.hasLunch ? itemCounter++ : 0;
  const dnSno = bill.hasDinner ? itemCounter++ : 0;

  // Invoice status badge styling
  const getStatusBadge = (status) => {
    const s = (status || 'Draft').toLowerCase();
    if (s === 'paid') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s === 'confirmed' || s === 'partial') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const totalPaid = (bill.advancePaid || 0) + (bill.amountPaid || 0);
  const balancePending = Math.max(0, (bill.grandTotal || 0) - totalPaid);

  return (
    <div className="admin-body min-h-screen bg-[#f8fafc] py-8 px-4 md:px-8 print:p-0 print:bg-white">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="max-w-5xl mx-auto mb-6 bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between no-print shadow-sm">
        <Link
          to="/admin"
          className="admin-btn-secondary inline-flex items-center gap-2 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="admin-btn-primary inline-flex items-center gap-2 py-2.5 px-6 cursor-pointer text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Invoice Document Box */}
      <div
        id="print-area"
        className="max-w-5xl mx-auto bg-white text-gray-800 shadow-xl rounded-2xl border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none print:max-w-none"
      >
        {/* Top Decorative Brand Gradient */}
        <div className="h-2 bg-gradient-to-r from-[#FF5C2B] via-[#FF825C] to-[#E04618]" />

        <div className="p-8 md:p-12 space-y-8 print:p-4">
          {/* Section 1: Header - Company Brand & Invoice Details */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-200 pb-8 gap-6">
            {/* Left: Logo & Company Address */}
            <div className="space-y-3 max-w-md">
              <div className="flex items-center gap-3">
                <img
                  src="/arunam_logo.png"
                  alt="Arunam Catering Logo"
                  className="h-14 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase">
                    ARUNAM <span className="text-[#FF5C2B]">CATERING</span>
                  </h1>
                  <p className="text-[10px] text-[#FF5C2B] font-extrabold tracking-[0.25em] uppercase mt-1">
                    Premium South Indian Culinary Excellence
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5C2B] shrink-0" />
                  <span>Krishnagiri, Tamil Nadu</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF5C2B] shrink-0" />
                  <span>+91 98848 89393, 98848 89394</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF5C2B] shrink-0" />
                  <span>info@arunamcatering.com</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#FF5C2B] shrink-0" />
                  <span>www.arunamcatering.com</span>
                </p>
              </div>
            </div>

            {/* Right: Invoice Identity Card */}
            <div className="w-full md:w-auto flex flex-col items-start md:items-end space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">STATUS:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusBadge(bill.status)}`}>
                  {bill.status || 'Draft'}
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full md:w-64 space-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-semibold text-gray-500 uppercase text-[10px] tracking-wider">Invoice No</span>
                  <span className="font-extrabold text-gray-900">#INV-{bill.sno}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-semibold text-gray-500 uppercase text-[10px] tracking-wider">Invoice Date</span>
                  <span className="font-bold text-gray-800">
                    {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-semibold text-gray-500 uppercase text-[10px] tracking-wider">Event Date</span>
                  <span className="font-bold text-[#FF5C2B]">
                    {bill.eventDate ? new Date(bill.eventDate).toLocaleDateString('en-IN') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500 uppercase text-[10px] tracking-wider">Function</span>
                  <span className="font-bold text-gray-900 truncate max-w-[120px]">
                    {bill.functionType || 'General Function'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Customer Info & Event Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Box */}
            <div className="bg-[#FAF7F2] rounded-xl p-5 border border-[#ECE5DB] relative">
              <div className="flex items-center gap-2 mb-3 border-b border-[#ECE5DB] pb-2">
                <User className="w-4 h-4 text-[#FF5C2B]" />
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-gray-700">Client / Billed To</h3>
              </div>
              <p className="text-base font-bold text-gray-900 capitalize">{bill.customer?.name || 'Valued Client'}</p>
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold">{bill.customer?.mobile || 'N/A'}</span>
                </p>
                {bill.customer?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{bill.customer.email}</span>
                  </p>
                )}
                {bill.customer?.address && (
                  <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line border-t border-[#ECE5DB] pt-2">
                    {bill.customer.address}
                  </p>
                )}
              </div>
            </div>

            {/* Event Overview Box */}
            <div className="bg-[#FAF7F2] rounded-xl p-5 border border-[#ECE5DB] relative">
              <div className="flex items-center gap-2 mb-3 border-b border-[#ECE5DB] pb-2">
                <Calendar className="w-4 h-4 text-[#FF5C2B]" />
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-gray-700">Event & Session Summary</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Function Type:</span>
                  <span className="font-bold text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                    {bill.functionType || 'General Function'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Sessions Booked:</span>
                  <span className="font-bold text-[#FF5C2B]">
                    {sessionsList.length > 0 ? sessionsList.map((s) => s.name).join(', ') : 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-[#ECE5DB] pt-2">
                  <span className="text-gray-600 font-medium">Total Guest Capacity:</span>
                  <span className="font-extrabold text-gray-900 text-sm">
                    {sessionsList.reduce((acc, curr) => acc + (curr.plates || 0), 0)} Total Plates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Professional Menu Breakdown (Rows & Columns for Dishes) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#FF5C2B]/20 pb-2">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#FF5C2B]" />
                <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Catering Menu Selection (Detailed Session Breakdown)
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Organized Itemized Menu
              </span>
            </div>

            {/* Breakfast Menu Section */}
            {bill.hasBreakfast && (
              <div className="border border-amber-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-amber-50/70 border-b border-amber-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    <span className="font-black text-amber-900 text-xs uppercase tracking-wider">
                      Breakfast Menu ({bill.breakfastPeople} Plates)
                    </span>
                  </div>
                  <div className="text-xs font-bold text-amber-800">
                    <span>₹{bill.breakfastRate} / Plate</span>
                    <span className="mx-2 text-amber-400">|</span>
                    <span>Session Total: ₹{(bill.breakfastPeople * bill.breakfastRate).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/10">
                  {bill.selectedBreakfastDishes && bill.selectedBreakfastDishes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 print:grid-cols-3">
                      {bill.selectedBreakfastDishes.map((dish, idx) => (
                        <div
                          key={dish}
                          className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-amber-100 text-xs font-semibold text-gray-800 shadow-2xs"
                        >
                          <span className="w-5 h-5 rounded-md bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span className="capitalize truncate">{dish}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-400 p-2">Standard Breakfast Menu items configured.</p>
                  )}
                </div>
              </div>
            )}

            {/* Lunch Menu Section */}
            {bill.hasLunch && (
              <div className="border border-orange-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-orange-50/70 border-b border-orange-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#FF5C2B]" />
                    <span className="font-black text-orange-950 text-xs uppercase tracking-wider">
                      Lunch Menu ({bill.lunchPeople} Plates)
                    </span>
                  </div>
                  <div className="text-xs font-bold text-orange-900">
                    <span>₹{bill.lunchRate} / Plate</span>
                    <span className="mx-2 text-orange-300">|</span>
                    <span>Session Total: ₹{(bill.lunchPeople * bill.lunchRate).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="p-4 bg-orange-50/10">
                  {bill.selectedLunchDishes && bill.selectedLunchDishes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 print:grid-cols-3">
                      {bill.selectedLunchDishes.map((dish, idx) => (
                        <div
                          key={dish}
                          className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-orange-100 text-xs font-semibold text-gray-800 shadow-2xs"
                        >
                          <span className="w-5 h-5 rounded-md bg-[#FF5C2B] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span className="capitalize truncate">{dish}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-400 p-2">Standard Lunch Menu items configured.</p>
                  )}
                </div>
              </div>
            )}

            {/* Dinner Menu Section */}
            {bill.hasDinner && (
              <div className="border border-indigo-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-indigo-50/70 border-b border-indigo-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="font-black text-indigo-950 text-xs uppercase tracking-wider">
                      Dinner Menu ({bill.dinnerPeople} Plates)
                    </span>
                  </div>
                  <div className="text-xs font-bold text-indigo-900">
                    <span>₹{bill.dinnerRate} / Plate</span>
                    <span className="mx-2 text-indigo-300">|</span>
                    <span>Session Total: ₹{(bill.dinnerPeople * bill.dinnerRate).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/10">
                  {bill.selectedDinnerDishes && bill.selectedDinnerDishes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 print:grid-cols-3">
                      {bill.selectedDinnerDishes.map((dish, idx) => (
                        <div
                          key={dish}
                          className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-indigo-100 text-xs font-semibold text-gray-800 shadow-2xs"
                        >
                          <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span className="capitalize truncate">{dish}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-400 p-2">Standard Dinner Menu items configured.</p>
                  )}
                </div>
              </div>
            )}

            {/* Live Counters & Food Stalls Section */}
            {bill.stalls && bill.stalls.length > 0 && (
              <div className="border border-emerald-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-emerald-50/70 border-b border-emerald-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-black text-emerald-950 text-xs uppercase tracking-wider">
                      Live Counters & Food Stalls
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">{bill.stalls.length} Stalls Configured</span>
                </div>

                <div className="p-4 space-y-4 bg-emerald-50/10">
                  {bill.stalls.map((s, idx) => {
                    const stallCost = s.pricingType === 'plates' ? (s.people || 0) * (s.rate || 0) : (s.fixedPrice || 0);
                    return (
                      <div key={s.id || idx} className="bg-white rounded-lg border border-emerald-150 p-3.5 space-y-2">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="font-extrabold text-xs text-gray-900 uppercase tracking-wide">
                            Stall #{idx + 1}: {s.name}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                            {s.pricingType === 'plates' ? `${s.people} Plts @ ₹${s.rate} = ₹${stallCost.toLocaleString('en-IN')}` : `Fixed: ₹${stallCost.toLocaleString('en-IN')}`}
                          </span>
                        </div>

                        {s.selectedDishes && s.selectedDishes.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                            {s.selectedDishes.map((d, dIdx) => (
                              <div key={d} className="flex items-center gap-2 text-[11px] font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                                <span className="text-emerald-600 font-bold text-[10px]">{dIdx + 1}.</span>
                                <span className="capitalize truncate">{d}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Master Cost Table (Itemized Charges Summary) */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 border-b border-gray-200 pb-2">
              Master Billing Summary Table
            </h3>
            <table className="w-full text-left border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-[11px] font-extrabold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4 w-12 text-center">S.No</th>
                  <th className="py-3 px-4">Service / Session Description</th>
                  <th className="py-3 px-4 text-center">Plates / Qty</th>
                  <th className="py-3 px-4 text-right">Unit Rate (₹)</th>
                  <th className="py-3 px-4 text-right pr-6">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs text-gray-800 font-medium">
                {bill.hasBreakfast && (
                  <tr className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 text-center font-bold text-gray-500">{bfSno}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">Breakfast Catering Service</td>
                    <td className="py-3.5 px-4 text-center font-semibold">{bill.breakfastPeople} Plates</td>
                    <td className="py-3.5 px-4 text-right">₹{bill.breakfastRate.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right pr-6 font-bold text-gray-900">
                      ₹{(bill.breakfastPeople * bill.breakfastRate).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {bill.hasLunch && (
                  <tr className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 text-center font-bold text-gray-500">{lnSno}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">Lunch Catering Service</td>
                    <td className="py-3.5 px-4 text-center font-semibold">{bill.lunchPeople} Plates</td>
                    <td className="py-3.5 px-4 text-right">₹{bill.lunchRate.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right pr-6 font-bold text-gray-900">
                      ₹{(bill.lunchPeople * bill.lunchRate).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {bill.hasDinner && (
                  <tr className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 text-center font-bold text-gray-500">{dnSno}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">Dinner Catering Service</td>
                    <td className="py-3.5 px-4 text-center font-semibold">{bill.dinnerPeople} Plates</td>
                    <td className="py-3.5 px-4 text-right">₹{bill.dinnerRate.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right pr-6 font-bold text-gray-900">
                      ₹{(bill.dinnerPeople * bill.dinnerRate).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {bill.stalls &&
                  bill.stalls.map((s, idx) => {
                    const stallCost = s.pricingType === 'plates' ? (s.people || 0) * (s.rate || 0) : (s.fixedPrice || 0);
                    return (
                      <tr key={s.id || idx} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 text-center font-bold text-gray-500">{itemCounter++}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">Live Counter Stall - {s.name}</td>
                        <td className="py-3.5 px-4 text-center font-semibold">
                          {s.pricingType === 'plates' ? `${s.people} Plates` : 'Fixed Package'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {s.pricingType === 'plates' ? `₹${s.rate}` : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right pr-6 font-bold text-gray-900">
                          ₹{stallCost.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}

                {bill.extraCharges &&
                  bill.extraCharges.map((ec, idx) => (
                    <tr key={ec.id || idx} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4 text-center font-bold text-gray-500">{itemCounter++}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">Support / Logistics - {ec.label}</td>
                      <td className="py-3.5 px-4 text-center font-semibold">1 Service</td>
                      <td className="py-3.5 px-4 text-right">₹{ec.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 text-right pr-6 font-bold text-gray-900">
                        ₹{ec.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Section 5: Terms & Detailed Financial Calculation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Terms & Bank Info */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-xs">
                <h4 className="font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF5C2B]" /> Payment & Service Terms
                </h4>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {bill.notes ||
                    '1. 50% advance booking amount required to confirm event dates.\n2. Balance payment to be cleared on or before the event date.\n3. Menu changes allowed up to 3 days before the event.'}
                </p>
              </div>

              <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#ECE5DB] text-xs space-y-1">
                <p className="font-extrabold text-[#FF5C2B] uppercase tracking-wider">Bank & GPay Payment Info</p>
                <p className="text-gray-700 font-semibold">Account: Arunam Catering Services</p>
                <p className="text-gray-600">GPay / PhonePe: +91 98848 89393</p>
              </div>
            </div>

            {/* Financial Ledger Calculation */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3 text-xs">
              <div className="flex justify-between items-center text-gray-600">
                <span className="font-semibold">Subtotal Amount:</span>
                <span className="font-bold text-gray-900">₹{(bill.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>

              {(bill.gstPercent || 0) > 0 && (
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-semibold">GST ({bill.gstPercent}%):</span>
                  <span className="font-bold text-gray-900">₹{(bill.gstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Grand Total Highlight Box */}
              <div className="bg-[#FF5C2B] text-white p-3.5 rounded-lg flex justify-between items-center shadow-md">
                <span className="font-extrabold uppercase tracking-wider text-xs">Grand Total</span>
                <span className="text-xl font-black">₹{(bill.grandTotal || 0).toLocaleString('en-IN')}</span>
              </div>

              {/* Ledger Summary */}
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Payment Ledger</p>

                {(bill.advancePaid || 0) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Advance Received
                      {bill.advancePaidDate ? ` (${new Date(bill.advancePaidDate).toLocaleDateString('en-IN')})` : ''}:
                    </span>
                    <span className="font-semibold text-emerald-700">₹{(bill.advancePaid || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                {(bill.amountPaid || 0) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Next Payment Received
                      {bill.amountPaidDate ? ` (${new Date(bill.amountPaidDate).toLocaleDateString('en-IN')})` : ''}:
                    </span>
                    <span className="font-semibold text-emerald-700">₹{(bill.amountPaid || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2">
                  <span>Total Received:</span>
                  <span className="text-emerald-700">₹{totalPaid.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="font-extrabold text-gray-900">Balance Outstanding:</span>
                  <span
                    className={`text-base font-black px-2.5 py-0.5 rounded border ${
                      balancePending > 0
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    ₹{balancePending.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Signature & Authorization Footer */}
          <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-6">
            <div>
              <p className="font-medium text-gray-500">Thank you for choosing Arunam Catering!</p>
              <p className="text-[10px] mt-0.5">Computer generated invoice. No signature required if printed electronically.</p>
            </div>
            <div className="text-center md:text-right">
              <div className="w-48 border-b-2 border-dashed border-gray-300 mx-auto md:ml-auto mb-2" />
              <p className="font-extrabold text-gray-800 uppercase tracking-wider text-[11px]">Authorized Signatory</p>
              <p className="text-[10px] text-gray-400">Arunam Catering Services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
