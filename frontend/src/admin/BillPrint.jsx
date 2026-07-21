import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBillById } from './adminStore';
import { ArrowLeft, Printer } from 'lucide-react';
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

  // Build rows
  let rowNo = 1;
  const rows = [];

  if (bill.hasBreakfast) {
    rows.push({
      no: rowNo++,
      description: 'Breakfast Catering Service',
      dishes: bill.selectedBreakfastDishes || [],
      qty: `${bill.breakfastPeople} Plates`,
      rate: bill.breakfastRate,
      amount: (bill.breakfastPeople || 0) * (bill.breakfastRate || 0),
      accent: '#D97706', // amber
    });
  }
  if (bill.hasLunch) {
    rows.push({
      no: rowNo++,
      description: 'Lunch Catering Service',
      dishes: bill.selectedLunchDishes || [],
      qty: `${bill.lunchPeople} Plates`,
      rate: bill.lunchRate,
      amount: (bill.lunchPeople || 0) * (bill.lunchRate || 0),
      accent: '#FF5C2B',
    });
  }
  if (bill.hasDinner) {
    rows.push({
      no: rowNo++,
      description: 'Dinner Catering Service',
      dishes: bill.selectedDinnerDishes || [],
      qty: `${bill.dinnerPeople} Plates`,
      rate: bill.dinnerRate,
      amount: (bill.dinnerPeople || 0) * (bill.dinnerRate || 0),
      accent: '#4F46E5',
    });
  }
  (bill.stalls || []).forEach((s) => {
    const amt = s.pricingType === 'plates' ? (s.people || 0) * (s.rate || 0) : (s.fixedPrice || 0);
    rows.push({
      no: rowNo++,
      description: `Live Counter — ${s.name}`,
      dishes: s.selectedDishes || [],
      qty: s.pricingType === 'plates' ? `${s.people} Plates` : 'Fixed Package',
      rate: s.pricingType === 'plates' ? s.rate : null,
      amount: amt,
      accent: '#059669',
    });
  });
  (bill.extraCharges || []).forEach((ec) => {
    rows.push({
      no: rowNo++,
      description: `Additional — ${ec.label}`,
      dishes: [],
      qty: '1 Service',
      rate: ec.amount,
      amount: ec.amount,
      accent: '#6B7280',
    });
  });

  const totalPaid = (bill.advancePaid || 0) + (bill.amountPaid || 0);
  const balancePending = Math.max(0, (bill.grandTotal || 0) - totalPaid);

  const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

  const invoiceDate = bill.createdAt
    ? new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const eventDate = bill.eventDate
    ? new Date(bill.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className="admin-body min-h-screen bg-[#f3ece3] py-8 px-4 md:px-8 print:p-0 print:bg-white">
      {/* Action Bar (hidden on print) */}
      <div className="max-w-3xl mx-auto mb-5 flex items-center justify-between no-print">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#3B1A0A] text-white px-6 py-2.5 rounded-xl shadow-md hover:bg-[#FF5C2B] transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / PDF
        </button>
      </div>

      {/* ═══ INVOICE DOCUMENT ═══ */}
      <div
        id="print-area"
        className="max-w-3xl mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── TOP HEADER ── */}
        <div className="flex items-stretch">
          {/* Left: Logo + company */}
          <div className="flex-1 p-7 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/arunam_logo.png"
                alt="Arunam Catering"
                className="h-16 w-auto object-contain"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
            <div className="text-xs text-gray-500 space-y-0.5 mt-2">
              <p className="text-gray-700 font-semibold text-sm">Arunam Catering Service</p>
              <p>Krishnagiri, Tamil Nadu</p>
              <p>+91 98848 89393 / 98848 89394</p>
              <p>arunamcateringservice@gmail.com</p>
              <p>www.arunamcatering.com</p>
            </div>
          </div>

          {/* Right: INVOICE block */}
          <div
            className="flex flex-col items-end justify-center px-8 py-6 min-w-[200px]"
            style={{ background: '#3B1A0A' }}
          >
            <p className="text-white font-black text-4xl tracking-widest uppercase">INVOICE</p>
            <p className="text-[#F5C48A] font-bold text-base mt-1">No. #{String(bill.sno || 0).padStart(4, '0')}</p>
            <div className="mt-4 text-right text-xs text-[#d4a472] space-y-1">
              <p><span className="text-[#F5C48A] font-semibold">Date:</span> {invoiceDate}</p>
              <p><span className="text-[#F5C48A] font-semibold">Event:</span> {eventDate}</p>
              <p className="mt-2">
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: bill.status === 'Paid' ? '#14532d' : '#7f1d1d',
                    color: bill.status === 'Paid' ? '#86efac' : '#fca5a5',
                  }}
                >
                  {bill.status || 'Draft'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── FROM / BILL TO ── */}
        <div className="grid grid-cols-2 px-7 py-5 border-t border-b border-gray-200 gap-6 bg-[#fdfaf6]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">From</p>
            <p className="text-sm font-bold text-gray-800">Arunam Catering Service</p>
            <p className="text-xs text-gray-500 mt-0.5">+91 98848 89393</p>
            <p className="text-xs text-gray-500">arunamcateringservice@gmail.com</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Bill To</p>
            <p className="text-sm font-bold text-gray-800 capitalize">{bill.customer?.name || 'Valued Client'}</p>
            {bill.customer?.mobile && <p className="text-xs text-gray-500 mt-0.5">{bill.customer.mobile}</p>}
            {bill.customer?.email && <p className="text-xs text-gray-500">{bill.customer.email}</p>}
            {bill.customer?.address && <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{bill.customer.address}</p>}
            {bill.functionType && (
              <p className="text-xs font-semibold text-[#FF5C2B] mt-1">{bill.functionType}</p>
            )}
          </div>
        </div>

        {/* ── ITEMS TABLE ── */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: '#C8995A' }}>
              <th className="py-3 px-4 text-white text-[10px] font-black uppercase tracking-wider w-10 text-center">#</th>
              <th className="py-3 px-4 text-white text-[10px] font-black uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-white text-[10px] font-black uppercase tracking-wider text-center">Qty / Plates</th>
              <th className="py-3 px-4 text-white text-[10px] font-black uppercase tracking-wider text-right">Unit Price</th>
              <th className="py-3 px-5 text-white text-[10px] font-black uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <>
                <tr
                  key={`row-${i}`}
                  style={{ background: i % 2 === 0 ? '#FFFDF9' : '#FDF6EC' }}
                >
                  <td className="py-3 px-4 text-xs font-bold text-gray-400 text-center align-top pt-4">{row.no}</td>
                  <td className="py-3 px-4 align-top">
                    <p className="text-xs font-bold text-gray-800">{row.description}</p>
                    {/* Vertical dish list */}
                    {row.dishes.length > 0 && (
                      <div className="mt-1.5 space-y-0.5">
                        {row.dishes.map((d, di) => (
                          <p key={di} className="text-[10.5px] text-gray-500 capitalize flex items-center gap-1.5">
                            <span className="font-bold" style={{ color: row.accent }}>{di + 1}.</span>
                            {d}
                          </p>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-700 text-center align-top pt-4">{row.qty}</td>
                  <td className="py-3 px-4 text-xs text-gray-700 text-right align-top pt-4">
                    {row.rate != null ? `₹${fmt(row.rate)}` : '—'}
                  </td>
                  <td className="py-3 px-5 text-xs font-bold text-gray-900 text-right align-top pt-4">
                    ₹{fmt(row.amount)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>

        {/* ── PAYMENT INFO + TOTALS ── */}
        <div className="grid grid-cols-2 px-7 py-6 gap-8 border-t-2 border-[#C8995A]/30 bg-[#fdfaf6]">
          {/* Payment Info */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Payment Info</p>
            <p className="text-xs font-bold text-gray-700">Arunam Catering Services</p>
            <p className="text-xs text-gray-500 mt-0.5">GPay / PhonePe: +91 98848 89393</p>

            {(bill.advancePaid || 0) > 0 && (
              <p className="text-xs text-gray-600 mt-2">
                Advance Paid: <span className="font-semibold text-emerald-700">₹{fmt(bill.advancePaid)}</span>
                {bill.advancePaidDate && <span className="text-gray-400"> ({new Date(bill.advancePaidDate).toLocaleDateString('en-IN')})</span>}
              </p>
            )}
            {(bill.amountPaid || 0) > 0 && (
              <p className="text-xs text-gray-600">
                Next Payment: <span className="font-semibold text-emerald-700">₹{fmt(bill.amountPaid)}</span>
                {bill.amountPaidDate && <span className="text-gray-400"> ({new Date(bill.amountPaidDate).toLocaleDateString('en-IN')})</span>}
              </p>
            )}
            {totalPaid > 0 && (
              <p className="text-xs font-bold text-gray-700 mt-1">
                Total Received: <span className="text-emerald-700">₹{fmt(totalPaid)}</span>
              </p>
            )}
          </div>

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span className="font-semibold">SUBTOTAL</span>
              <span className="font-bold text-gray-800">₹{fmt(bill.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span className="font-semibold">
                {(bill.gstPercent || 0) > 0 ? `GST (${bill.gstPercent}%)` : 'GST'}
              </span>
              <span className="font-bold text-gray-800">
                {(bill.gstPercent || 0) > 0 ? `₹${fmt(bill.gstAmount)}` : '₹0'}
              </span>
            </div>
            <div
              className="flex justify-between items-center px-4 py-2.5 mt-1"
              style={{ background: '#3B1A0A' }}
            >
              <span className="text-[11px] font-black uppercase tracking-widest text-[#F5C48A]">TOTAL</span>
              <span className="text-base font-black text-white">₹{fmt(bill.grandTotal)}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="font-semibold text-gray-600">Balance Outstanding</span>
              <span
                className={`font-black text-sm ${balancePending > 0 ? 'text-red-600' : 'text-emerald-600'}`}
              >
                ₹{fmt(balancePending)}
              </span>
            </div>
          </div>
        </div>

        {/* ── TERMS & CONDITIONS ── */}
        <div className="px-7 pb-7 border-t border-gray-200 pt-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Terms &amp; Conditions</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {bill.notes ||
              '1. 50% advance booking amount required to confirm event dates. 2. Balance payment to be cleared on or before the event date. 3. Menu changes allowed up to 3 days before the event. 4. This is a computer generated invoice.'}
          </p>

          {/* Signature */}
          <div className="mt-8 flex justify-end">
            <div className="text-right">
              <div className="w-44 border-b-2 border-dashed border-gray-300 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Authorized Signatory</p>
              <p className="text-[10px] text-gray-400">Arunam Catering Services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
