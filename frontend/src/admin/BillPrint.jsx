import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBillById } from './adminStore';
import { ArrowLeft, Printer, MapPin, Phone, Mail, Globe } from 'lucide-react';
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
        <span className="inline-block w-8 h-8 border-4 border-[#FF5C2B]/30 border-t-[#FF5C2B] rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate plate counts totals
  const plateBreakdown = [];
  if (bill.hasBreakfast) {
    plateBreakdown.push(`Breakfast (${bill.breakfastPeople} Plates)`);
  }
  if (bill.hasLunch) {
    plateBreakdown.push(`Lunch (${bill.lunchPeople} Plates)`);
  }
  if (bill.hasDinner) {
    plateBreakdown.push(`Dinner (${bill.dinnerPeople} Plates)`);
  }

  let bfSno = 0;
  let lnSno = 0;
  let dnSno = 0;
  let currentSno = 1;
  if (bill.hasBreakfast) bfSno = currentSno++;
  if (bill.hasLunch) lnSno = currentSno++;
  if (bill.hasDinner) dnSno = currentSno++;

  return (
    <div className="admin-body min-h-screen bg-[#fcfbfa] py-8 px-4 md:px-8">
      {/* Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-8 bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between no-print shadow-sm">
        <Link
          to="/admin"
          className="admin-btn-secondary inline-flex items-center gap-2 py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <button
          onClick={handlePrint}
          className="admin-btn-primary inline-flex items-center gap-2 py-2.5 px-5 cursor-pointer text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Invoice Document Box */}
      <div
        id="print-area"
        className="max-w-4xl mx-auto bg-white text-gray-800 p-8 md:p-12 shadow-md rounded-xl border border-gray-200 print:shadow-none print:border-none print:p-0"
        style={{ color: '#2d3748', background: '#ffffff' }}
      >
        {/* Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-200 pb-8">
          {/* Company Details with logo instead of text */}
          <div>
            <div className="mb-4">
              <img
                src="/arunam_logo.png"
                alt="Arunam Catering Logo"
                className="h-16 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'; // hide if broken
                }}
              />
            </div>
            <p className="text-xs text-[#FF5C2B] font-bold tracking-[0.25em] uppercase mt-1">
              Premium South Indian Culinary Excellence
            </p>
            
            <div className="mt-6 space-y-2 text-xs text-gray-500">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span>Krishnagiri</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>+91 98848 89393, +91 98848 89394</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span>info@arunamcatering.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                <span>www.arunamcatering.com</span>
              </p>
            </div>
          </div>

          {/* Invoice Properties */}
          <div className="md:text-right flex flex-col md:items-end justify-between">
            <div className="bg-[#FF5C2B]/5 border border-[#FF5C2B]/20 rounded-lg py-2 px-4 inline-block md:text-right">
              <span className="text-[10px] uppercase font-bold text-[#FF5C2B] tracking-widest block">Invoice Status</span>
              <span className="text-sm font-bold text-gray-800 uppercase">{bill.status || 'Draft'}</span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-500 mt-4 md:mt-0">
              <p>
                <span className="font-semibold text-gray-700">Invoice S.No:</span>{' '}
                <span className="font-bold text-gray-900">#{bill.sno}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Booking/Event Date:</span>{' '}
                <span className="font-bold text-gray-900">
                  {bill.eventDate ? new Date(bill.eventDate).toLocaleDateString('en-IN') : 'N/A'}
                </span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Function Type:</span>{' '}
                <span className="font-bold text-[#FF5C2B]">{bill.functionType || 'General Function'}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Plate Counts:</span>{' '}
                <span className="font-bold text-gray-900">
                  {plateBreakdown.length > 0 ? plateBreakdown.join(', ') : 'No session plate counts set'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-lg p-6 border border-gray-150">
          <div className="md:col-span-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Billed To</h3>
            <p className="text-base font-bold text-gray-900">{bill.customer?.name}</p>
            {bill.customer?.email && <p className="text-xs text-gray-500 mt-1">{bill.customer?.email}</p>}
            <p className="text-xs text-gray-600 leading-relaxed mt-2 whitespace-pre-line">{bill.customer?.address}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Contact Details</h3>
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" /> {bill.customer?.mobile}
            </p>
          </div>
        </div>

        {/* Plate Rates Details (Without AMOUNT column) */}
        <div className="my-8">
          <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2.5 mb-4">
            Catering Packages & Sessions
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 pr-4">S.No</th>
                <th className="py-3">Menu Selected Dishes (Vertical Order)</th>
                <th className="py-3 text-right">Plate Count</th>
                <th className="py-3 text-right pr-4">Plate Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {/* Breakfast Details */}
              {bill.hasBreakfast && (
                <tr>
                  <td className="py-4 pr-4 font-bold text-gray-900 vertical-top">{bfSno}</td>
                  <td className="py-4 text-gray-650 max-w-sm">
                    {bill.selectedBreakfastDishes && bill.selectedBreakfastDishes.length > 0 ? (
                      <div>
                        <div className="font-bold text-[#FF5C2B] uppercase tracking-wider mb-1.5 text-[10px]">
                          Breakfast Menu:
                        </div>
                        <ol className="space-y-1 text-gray-705 font-medium leading-relaxed">
                          {bill.selectedBreakfastDishes.map((dish, idx) => (
                            <li key={dish} className="capitalize flex items-start gap-1">
                              <span className="text-[#FF5C2B] font-bold shrink-0">{idx + 1}.</span>
                              <span>{dish}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <span className="italic text-gray-400">No dishes listed</span>
                    )}
                  </td>
                  <td className="py-4 text-right font-semibold text-gray-900">{bill.breakfastPeople} Plates</td>
                  <td className="py-4 text-right pr-4">₹{bill.breakfastRate.toLocaleString('en-IN')}</td>
                </tr>
              )}

              {/* Lunch Details */}
              {bill.hasLunch && (
                <tr>
                  <td className="py-4 pr-4 font-bold text-gray-900 vertical-top">{lnSno}</td>
                  <td className="py-4 text-gray-650 max-w-sm">
                    {bill.selectedLunchDishes && bill.selectedLunchDishes.length > 0 ? (
                      <div>
                        <div className="font-bold text-[#FF5C2B] uppercase tracking-wider mb-1.5 text-[10px]">
                          Lunch Menu:
                        </div>
                        <ol className="space-y-1 text-gray-705 font-medium leading-relaxed">
                          {bill.selectedLunchDishes.map((dish, idx) => (
                            <li key={dish} className="capitalize flex items-start gap-1">
                              <span className="text-[#FF5C2B] font-bold shrink-0">{idx + 1}.</span>
                              <span>{dish}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <span className="italic text-gray-400">No dishes listed</span>
                    )}
                  </td>
                  <td className="py-4 text-right font-semibold text-gray-900">{bill.lunchPeople} Plates</td>
                  <td className="py-4 text-right pr-4">₹{bill.lunchRate.toLocaleString('en-IN')}</td>
                </tr>
              )}

              {/* Dinner Details */}
              {bill.hasDinner && (
                <tr>
                  <td className="py-4 pr-4 font-bold text-gray-900 vertical-top">{dnSno}</td>
                  <td className="py-4 text-gray-650 max-w-sm">
                    {bill.selectedDinnerDishes && bill.selectedDinnerDishes.length > 0 ? (
                      <div>
                        <div className="font-bold text-[#FF5C2B] uppercase tracking-wider mb-1.5 text-[10px]">
                          Dinner Menu:
                        </div>
                        <ol className="space-y-1 text-gray-705 font-medium leading-relaxed">
                          {bill.selectedDinnerDishes.map((dish, idx) => (
                            <li key={dish} className="capitalize flex items-start gap-1">
                              <span className="text-[#FF5C2B] font-bold shrink-0">{idx + 1}.</span>
                              <span>{dish}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <span className="italic text-gray-400">No dishes listed</span>
                    )}
                  </td>
                  <td className="py-4 text-right font-semibold text-gray-900">{bill.dinnerPeople} Plates</td>
                  <td className="py-4 text-right pr-4">₹{bill.dinnerRate.toLocaleString('en-IN')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Live Stalls Details (Without AMOUNT column) */}
        {bill.stalls && bill.stalls.length > 0 && (
          <div className="my-8">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2.5 mb-4">
              Live Counters & Food Stalls
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 pr-4">Stall Name</th>
                  <th className="py-3">Stall Items / Menu (Vertical Order)</th>
                  <th className="py-3 text-right">Billing Logic</th>
                  <th className="py-3 text-right pr-4">Qty Count / Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {bill.stalls.map((s, idx) => {
                  return (
                    <tr key={s.id || idx}>
                      <td className="py-4 pr-4 font-bold text-gray-900 vertical-top">{s.name}</td>
                      <td className="py-4 text-gray-650 max-w-xs">
                        {s.selectedDishes && s.selectedDishes.length > 0 ? (
                          <div>
                            <div className="font-bold text-[#FF5C2B] uppercase tracking-wider mb-1.5 text-[10px]">
                              Stall Menu:
                            </div>
                            <ol className="space-y-1 text-gray-705 font-medium leading-relaxed">
                              {s.selectedDishes.map((d, dIdx) => (
                                <li key={d} className="capitalize flex items-start gap-1">
                                  <span className="text-[#FF5C2B] font-bold shrink-0">{dIdx + 1}.</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ) : (
                          <span className="italic text-gray-400">General Stall Setup</span>
                        )}
                      </td>
                      <td className="py-4 text-right uppercase font-semibold text-gray-500 vertical-top">
                        {s.pricingType === 'plates' ? 'Plates Count' : 'Rs Count'}
                      </td>
                      <td className="py-4 text-right font-medium text-gray-900 pr-4 vertical-top">
                        {s.pricingType === 'plates' ? `${s.people} @ ₹${s.rate}` : `Fixed Rate: ₹${s.fixedPrice.toLocaleString('en-IN')}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Extra Logistics Charges (Without duplicate AMOUNT header inside table if we keep simple list style) */}
        {bill.extraCharges && bill.extraCharges.length > 0 && (
          <div className="my-8">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2.5 mb-4">
              Logistics & Service Support Fees
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3">Description</th>
                  <th className="py-3 text-right pr-4">Cost Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-750">
                {bill.extraCharges.map((charge, idx) => (
                  <tr key={charge.id || idx}>
                    <td className="py-3 font-medium text-gray-800">{charge.label}</td>
                    <td className="py-3 text-right font-semibold text-gray-900 pr-4">
                      ₹{charge.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pricing Subtotal / GST / Grand Total Grid (With detailed calculations here below) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Terms & Notes</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed whitespace-pre-line">{bill.notes}</p>
          </div>
          <div className="flex flex-col justify-end">
            <div className="space-y-2.5 text-xs text-gray-600">
              
              {/* Detailed Cost Line Items */}
              <div className="space-y-1 border-b border-gray-100 pb-2 text-gray-500">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Catering Cost Breakdown</p>
                {bill.hasBreakfast && (
                  <div className="flex justify-between">
                    <span>Breakfast ({bill.breakfastPeople} Plts @ ₹{bill.breakfastRate}):</span>
                    <span>₹{(bill.breakfastPeople * bill.breakfastRate).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {bill.hasLunch && (
                  <div className="flex justify-between">
                    <span>Lunch ({bill.lunchPeople} Plts @ ₹{bill.lunchRate}):</span>
                    <span>₹{(bill.lunchPeople * bill.lunchRate).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {bill.hasDinner && (
                  <div className="flex justify-between">
                    <span>Dinner ({bill.dinnerPeople} Plts @ ₹{bill.dinnerRate}):</span>
                    <span>₹{(bill.dinnerPeople * bill.dinnerRate).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {bill.stalls && bill.stalls.map((s, idx) => {
                  const cost = s.pricingType === 'plates' ? s.people * s.rate : s.fixedPrice;
                  return (
                    <div key={s.id || idx} className="flex justify-between text-gray-550">
                      <span>Stall - {s.name}:</span>
                      <span>₹{cost.toLocaleString('en-IN')}</span>
                    </div>
                  );
                })}
                {bill.extraCharges && bill.extraCharges.map((ec, idx) => (
                  <div key={ec.id || idx} className="flex justify-between text-gray-550">
                    <span>Support - {ec.label}:</span>
                    <span>₹{ec.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Sub Total, GST and Grand Total */}
              <div className="flex justify-between font-bold text-gray-800">
                <span>Sub Total:</span>
                <span>₹{(bill.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST ({bill.gstPercent || 0}%):</span>
                <span>₹{(bill.gstAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-2.5 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-gray-900">Grand Total:</span>
                <span className="text-xl font-black text-[#FF5C2B]">
                  ₹{(bill.grandTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Log Ledger Summary */}
              <div className="border-t-2 border-dashed border-gray-200 pt-3 mt-3 space-y-1.5 text-gray-500">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Receipt & Ledger Summary</p>
                
                {(bill.advancePaid || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Advance Amount Paid{bill.advancePaidDate ? ` (on ${bill.advancePaidDate.split('T')[0]})` : ''}:</span>
                    <span>₹{(bill.advancePaid || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {(bill.amountPaid || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Next Amount Paid{bill.amountPaidDate ? ` (on ${bill.amountPaidDate.split('T')[0]})` : ''}:</span>
                    <span>₹{(bill.amountPaid || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-gray-100 pt-1 font-semibold text-gray-700">
                  <span>Total Amount Paid:</span>
                  <span>₹{((bill.advancePaid || 0) + (bill.amountPaid || 0)).toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-gray-800">Balance Pending:</span>
                  <span className={`text-base font-black ${
                    (bill.grandTotal - (bill.advancePaid || 0) - (bill.amountPaid || 0)) > 0
                      ? 'text-[#FF5C2B]'
                      : 'text-green-600'
                  }`}>
                    ₹{Math.max(0, bill.grandTotal - (bill.advancePaid || 0) - (bill.amountPaid || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Signature Section */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <p>Generated automatically on {new Date(bill.createdAt || new Date()).toLocaleString('en-IN')}</p>
          <div className="text-right">
            <div className="w-40 border-b border-gray-300 mx-auto md:ml-auto mb-2" />
            <p className="font-bold text-gray-700 uppercase">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
