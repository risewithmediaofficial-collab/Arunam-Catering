import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, PlusCircle, Upload, Check, Info, Users, Search } from 'lucide-react';
import { getBillById, saveBill, getBills, getCustomers } from './adminStore';
import { TIFFIN_MENUS, LUNCH_MENUS, DINNER_MENUS, SMART_CHOICE_MENUS, CATEGORY_MENUS } from './presetMenus';
import * as XLSX from 'xlsx';
import './admin.css';

// Default Catering dishes lists (Starting empty)
const DEFAULT_MENU_OPTIONS = {
  breakfast: [],
  lunch: [],
  dinner: [],
  stalls: []
};

const FUNCTION_TYPES = [
  'Marriage',
  'Reception',
  'Birthday Party',
  'Housewarming',
  'Engagement Ceremony',
  'Corporate Event',
  'Family Get-Together',
  'Other Custom Function'
];

export default function BillForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  // Bill Core Details
  const [sno, setSno] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [functionType, setFunctionType] = useState('Marriage');
  const [customFunctionType, setCustomFunctionType] = useState('');
  const [status, setStatus] = useState('Draft');
  const [notes, setNotes] = useState('Thank you for choosing Arunam Catering.');

  // Customers for autofill dropdown
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Search filter query for each session list
  const [searchQueries, setSearchQueries] = useState({ breakfast: '', lunch: '', dinner: '', stalls: '' });

  // Payment Log / Ledger
  const [advancePaid, setAdvancePaid] = useState(0);
  const [advancePaidDate, setAdvancePaidDate] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountPaidDate, setAmountPaidDate] = useState('');

  // Menu options (Excel templates get imported here)
  const [menuOptions, setMenuOptions] = useState(DEFAULT_MENU_OPTIONS);

  // Meal Sessions Setup (Boolean flag, plate count, plate rate, selected dishes)
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [breakfastPeople, setBreakfastPeople] = useState(0);
  const [breakfastRate, setBreakfastRate] = useState(0);
  const [selectedBreakfastDishes, setSelectedBreakfastDishes] = useState([]);

  const [hasLunch, setHasLunch] = useState(false);
  const [lunchPeople, setLunchPeople] = useState(0);
  const [lunchRate, setLunchRate] = useState(0);
  const [selectedLunchDishes, setSelectedLunchDishes] = useState([]);

  const [hasDinner, setHasDinner] = useState(false);
  const [dinnerPeople, setDinnerPeople] = useState(0);
  const [dinnerRate, setDinnerRate] = useState(0);
  const [selectedDinnerDishes, setSelectedDinnerDishes] = useState([]);

  // Stalls Setup (Stall dishes, pricing type [plates vs fixed], plate count, plate rate, fixed price)
  const [stalls, setStalls] = useState([]);

  // Extra Logistics/Service Charges
  const [extraCharges, setExtraCharges] = useState([]);

  // Totals States
  const [subtotal, setSubtotal] = useState(0);
  const [gstPercent, setGstPercent] = useState(0); // GST default to 0%
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Temporary dropdown values
  const [tempDishInput, setTempDishInput] = useState({ breakfast: '', lunch: '', dinner: '', stalls: '' });

  // Load existing bill if editing
  useEffect(() => {
    async function loadData() {
      // Load customers directory list
      const clist = await getCustomers();
      setCustomersList(clist);

      if (isEditMode) {
        const existing = await getBillById(id);
        if (existing) {
          setSno(existing.sno);
          setCustomerName(existing.customer?.name || '');
          setCustomerAddress(existing.customer?.address || '');
          setCustomerMobile(existing.customer?.mobile || '');
          setCustomerEmail(existing.customer?.email || '');
          setEventDate(existing.eventDate || '');
          
          // Handle function type dropdown
          if (FUNCTION_TYPES.includes(existing.functionType)) {
            setFunctionType(existing.functionType);
            setCustomFunctionType('');
          } else {
            setFunctionType('Other Custom Function');
            setCustomFunctionType(existing.functionType || '');
          }

          setStatus(existing.status || 'Draft');
          setNotes(existing.notes || '');

          // Session recovery
          setHasBreakfast(!!existing.hasBreakfast);
          setBreakfastPeople(existing.breakfastPeople || 0);
          setBreakfastRate(existing.breakfastRate || 0);
          setSelectedBreakfastDishes(existing.selectedBreakfastDishes || []);

          setHasLunch(!!existing.hasLunch);
          setLunchPeople(existing.lunchPeople || 0);
          setLunchRate(existing.lunchRate || 0);
          setSelectedLunchDishes(existing.selectedLunchDishes || []);

          setHasDinner(!!existing.hasDinner);
          setDinnerPeople(existing.dinnerPeople || 0);
          setDinnerRate(existing.dinnerRate || 0);
          setSelectedDinnerDishes(existing.selectedDinnerDishes || []);

          setStalls(existing.stalls || []);
          setExtraCharges(existing.extraCharges || []);
          setGstPercent(existing.gstPercent !== undefined ? existing.gstPercent : 5);
          if (existing.menuOptions) {
            setMenuOptions(existing.menuOptions);
          }

          // Payment log recovery
          setAdvancePaid(existing.advancePaid || 0);
          setAdvancePaidDate(existing.advancePaidDate || '');
          setAmountPaid(existing.amountPaid || 0);
          setAmountPaidDate(existing.amountPaidDate || '');
        } else {
          alert('Bill not found!');
          navigate('/admin');
        }
      } else {
        // Auto-assign next S.No
        const allBills = await getBills();
        const maxSno = allBills.reduce((max, b) => (b.sno > max ? b.sno : max), 0);
        setSno(maxSno + 1);
      }
    }
    loadData();
  }, [id, isEditMode, navigate]);

  // Handle Excel Menu template loading
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });

        let importedBreakfast = [];
        let importedLunch = [];
        let importedDinner = [];
        let importedStalls = [];

        // Check if Excel has specific category sheets
        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          const items = data
            .flat()
            .map((item) => String(item).trim())
            .filter((item) => item !== '' && !item.toLowerCase().includes('sheet') && !item.toLowerCase().includes('menu'));

          const lowerSheet = sheetName.toLowerCase();
          if (lowerSheet.includes('breakfast')) {
            importedBreakfast = items;
          } else if (lowerSheet.includes('lunch')) {
            importedLunch = items;
          } else if (lowerSheet.includes('dinner')) {
            importedDinner = items;
          } else if (lowerSheet.includes('stall') || lowerSheet.includes('drink')) {
            importedStalls = items;
          }
        });

        // Or search column headers if only one main sheet exists
        if (
          wb.SheetNames.length === 1 ||
          (importedBreakfast.length === 0 && importedLunch.length === 0 && importedDinner.length === 0)
        ) {
          const firstSheet = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet);
          rows.forEach((row) => {
            Object.keys(row).forEach((key) => {
              const val = row[key];
              if (!val) return;
              const lowerKey = key.toLowerCase();
              if (lowerKey.includes('breakfast')) {
                importedBreakfast.push(String(val).trim());
              } else if (lowerKey.includes('lunch')) {
                importedLunch.push(String(val).trim());
              } else if (lowerKey.includes('dinner')) {
                importedDinner.push(String(val).trim());
              } else if (lowerKey.includes('stall') || lowerKey.includes('drink')) {
                importedStalls.push(String(val).trim());
              }
            });
          });
        }

        const newMenuOptions = {
          breakfast: importedBreakfast.length > 0 ? [...new Set(importedBreakfast)] : menuOptions.breakfast,
          lunch: importedLunch.length > 0 ? [...new Set(importedLunch)] : menuOptions.lunch,
          dinner: importedDinner.length > 0 ? [...new Set(importedDinner)] : menuOptions.dinner,
          stalls: importedStalls.length > 0 ? [...new Set(importedStalls)] : menuOptions.stalls
        };

        setMenuOptions(newMenuOptions);
        alert(
          `Excel Menu Template successfully loaded!\n• Breakfast: ${newMenuOptions.breakfast.length} items\n• Lunch: ${newMenuOptions.lunch.length} items\n• Dinner: ${newMenuOptions.dinner.length} items\n• Stalls: ${newMenuOptions.stalls.length} items`
        );
      } catch (err) {
        console.error(err);
        alert('Failed to parse Excel file. Please verify sheet columns or headers.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Trigger Excel file input
  const triggerExcelFileInput = () => {
    fileInputRef.current.click();
  };

  // Recalculate Subtotal, GST and Grand Total
  useEffect(() => {
    let bfCost = hasBreakfast ? breakfastPeople * breakfastRate : 0;
    let lnCost = hasLunch ? lunchPeople * lunchRate : 0;
    let dnCost = hasDinner ? dinnerPeople * dinnerRate : 0;

    let stallsCost = stalls.reduce((sum, s) => {
      if (s.pricingType === 'plates') {
        return sum + (s.people * s.rate);
      } else {
        return sum + (Number(s.fixedPrice) || 0);
      }
    }, 0);

    let extrasCost = extraCharges.reduce((sum, ec) => sum + (Number(ec.amount) || 0), 0);

    const calcSubtotal = bfCost + lnCost + dnCost + stallsCost + extrasCost;
    const calcGstAmount = Math.round((calcSubtotal * gstPercent) / 100);
    const calcGrandTotal = calcSubtotal + calcGstAmount;

    setSubtotal(calcSubtotal);
    setGstAmount(calcGstAmount);
    setGrandTotal(calcGrandTotal);
  }, [
    hasBreakfast, breakfastPeople, breakfastRate,
    hasLunch, lunchPeople, lunchRate,
    hasDinner, dinnerPeople, dinnerRate,
    stalls, extraCharges, gstPercent
  ]);

  // Dish selectors
  const toggleDishSelection = (category, dish) => {
    if (category === 'breakfast') {
      setSelectedBreakfastDishes((prev) =>
        prev.includes(dish) ? prev.filter((d) => d !== dish) : [...prev, dish]
      );
    } else if (category === 'lunch') {
      setSelectedLunchDishes((prev) =>
        prev.includes(dish) ? prev.filter((d) => d !== dish) : [...prev, dish]
      );
    } else if (category === 'dinner') {
      setSelectedDinnerDishes((prev) =>
        prev.includes(dish) ? prev.filter((d) => d !== dish) : [...prev, dish]
      );
    }
  };

  const handleAddNewDishPreset = (category) => {
    const newVal = tempDishInput[category].trim();
    if (!newVal) return;
    if (menuOptions[category].includes(newVal)) {
      alert('Item already exists in selection preset.');
      return;
    }
    setMenuOptions((prev) => ({
      ...prev,
      [category]: [...prev[category], newVal]
    }));
    setTempDishInput((prev) => ({ ...prev, [category]: '' }));
    // Auto-select the newly added item
    if (category === 'breakfast') setSelectedBreakfastDishes((prev) => [...prev, newVal]);
    else if (category === 'lunch') setSelectedLunchDishes((prev) => [...prev, newVal]);
    else if (category === 'dinner') setSelectedDinnerDishes((prev) => [...prev, newVal]);
  };

  // Stall CRUD
  const handleAddStall = () => {
    setStalls([
      ...stalls,
      {
        id: crypto.randomUUID(),
        name: 'Live Food Stall',
        selectedDishes: [],
        pricingType: 'plates',
        people: 299,
        rate: 50,
        fixedPrice: 0
      }
    ]);
  };

  const handleUpdateStallField = (stallId, field, value) => {
    const updated = stalls.map((s) => {
      if (s.id === stallId) {
        const u = { ...s, [field]: value };
        return u;
      }
      return s;
    });
    setStalls(updated);
  };

  const toggleStallDish = (stallId, dishName) => {
    const updated = stalls.map((s) => {
      if (s.id === stallId) {
        const dishes = s.selectedDishes.includes(dishName)
          ? s.selectedDishes.filter((d) => d !== dishName)
          : [...s.selectedDishes, dishName];
        return { ...s, selectedDishes: dishes };
      }
      return s;
    });
    setStalls(updated);
  };

  const handleRemoveStall = (stallId) => {
    setStalls(stalls.filter((s) => s.id !== stallId));
  };

  // Extras CRUD
  const handleAddExtraCharge = () => {
    setExtraCharges([...extraCharges, { id: crypto.randomUUID(), label: '', amount: 0 }]);
  };

  const handleExtraChargeChange = (chargeId, field, value) => {
    const updated = extraCharges.map((charge) => {
      if (charge.id === chargeId) {
        return { ...charge, [field]: field === 'amount' ? Number(value) : value };
      }
      return charge;
    });
    setExtraCharges(updated);
  };

  const handleRemoveExtraCharge = (chargeId) => {
    setExtraCharges(extraCharges.filter((c) => c.id !== chargeId));
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomerId(customerId);
    if (!customerId) {
      setCustomerName('');
      setCustomerMobile('');
      setCustomerAddress('');
      setCustomerEmail('');
      return;
    }
    const customer = customersList.find(c => c._id === customerId);
    if (customer) {
      setCustomerName(customer.name || '');
      setCustomerMobile(customer.mobile || '');
      setCustomerAddress(customer.address || '');
      setCustomerEmail(customer.email || '');
    }
  };

  const handleApplyPreset = (session, selection) => {
    if (!selection) return;

    if (selection.startsWith('cat:')) {
      const catKey = selection.substring(4);
      const items = CATEGORY_MENUS[catKey] || [];
      setMenuOptions(prev => {
        const currentOptions = prev[session] || [];
        const merged = Array.from(new Set([...currentOptions, ...items]));
        return { ...prev, [session]: merged };
      });
    } else {
      let items = [];
      if (selection.startsWith('tiffin:')) {
        items = TIFFIN_MENUS[selection.substring(7)] || [];
      } else if (selection.startsWith('lunch:')) {
        items = LUNCH_MENUS[selection.substring(6)] || [];
      } else if (selection.startsWith('dinner:')) {
        items = DINNER_MENUS[selection.substring(7)] || [];
      } else if (selection.startsWith('smart:')) {
        items = SMART_CHOICE_MENUS[selection.substring(6)] || [];
      }

      if (items.length > 0) {
        setMenuOptions(prev => {
          const currentOptions = prev[session] || [];
          const merged = Array.from(new Set([...currentOptions, ...items]));
          return { ...prev, [session]: merged };
        });

        if (session === 'breakfast') {
          setSelectedBreakfastDishes(items);
        } else if (session === 'lunch') {
          setSelectedLunchDishes(items);
        } else if (session === 'dinner') {
          setSelectedDinnerDishes(items);
        }
      }
    }
  };

  const handleApplyStallPreset = (stallId, selection) => {
    if (!selection) return;

    let items = [];
    if (selection.startsWith('cat:')) {
      items = CATEGORY_MENUS[selection.substring(4)] || [];
    } else if (selection.startsWith('tiffin:')) {
      items = TIFFIN_MENUS[selection.substring(7)] || [];
    } else if (selection.startsWith('lunch:')) {
      items = LUNCH_MENUS[selection.substring(6)] || [];
    } else if (selection.startsWith('dinner:')) {
      items = DINNER_MENUS[selection.substring(7)] || [];
    } else if (selection.startsWith('smart:')) {
      items = SMART_CHOICE_MENUS[selection.substring(6)] || [];
    }

    if (items.length > 0) {
      setMenuOptions(prev => {
        const currentOptions = prev.stalls || [];
        const merged = Array.from(new Set([...currentOptions, ...items]));
        return { ...prev, stalls: merged };
      });

      setStalls(prev => prev.map(s => {
        if (s.id === stallId) {
          const mergedDishes = Array.from(new Set([...s.selectedDishes, ...items]));
          return { ...s, selectedDishes: mergedDishes };
        }
        return s;
      }));
    }
  };

  // Submit Invoice Form
  const handleSave = async (e) => {
    e.preventDefault();
    if (!customerName || !customerMobile) {
      alert('Please fill customer details (Name and Mobile Number).');
      return;
    }

    const finalFunctionType = functionType === 'Other Custom Function' ? customFunctionType : functionType;
    const balancePending = Math.max(0, grandTotal - (Number(advancePaid) || 0) - (Number(amountPaid) || 0));

    const billData = {
      id: id || undefined,
      sno: Number(sno),
      customer: {
        name: customerName,
        address: customerAddress,
        mobile: customerMobile,
        email: customerEmail
      },
      eventDate,
      functionType: finalFunctionType,
      status,
      notes,
      
      // Meal Options state
      menuOptions,

      // Breakfast configs
      hasBreakfast,
      breakfastPeople: hasBreakfast ? Number(breakfastPeople) : 0,
      breakfastRate: hasBreakfast ? Number(breakfastRate) : 0,
      selectedBreakfastDishes,

      // Lunch configs
      hasLunch,
      lunchPeople: hasLunch ? Number(lunchPeople) : 0,
      lunchRate: hasLunch ? Number(lunchRate) : 0,
      selectedLunchDishes,

      // Dinner configs
      hasDinner,
      dinnerPeople: hasDinner ? Number(dinnerPeople) : 0,
      dinnerRate: hasDinner ? Number(dinnerRate) : 0,
      selectedDinnerDishes,

      // Stalls
      stalls,

      // Extras & Totals
      extraCharges,
      subtotal,
      gstPercent,
      gstAmount,
      grandTotal,

      // Payment Log
      advancePaid: Number(advancePaid) || 0,
      advancePaidDate,
      amountPaid: Number(amountPaid) || 0,
      amountPaidDate,
      balancePending
    };

    const saved = await saveBill(billData);
    if (saved) {
      alert(`Catering Bill #${saved.sno} successfully saved!`);
      navigate('/admin');
    }
  };

  return (
    <div className="space-y-8 bg-[#fcfbfa] pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 bg-white hover:bg-gray-100 text-gray-500 hover:text-black rounded-lg border border-gray-200 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              {isEditMode ? `Edit Invoice #${sno}` : 'New Manual Catering Bill'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Specify function plates, Stall counts, import from excel & save details
            </p>
          </div>
        </div>

        {/* Excel Importer Trigger Button */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            ref={fileInputRef}
            onChange={handleExcelUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerExcelFileInput}
            className="admin-btn-secondary inline-flex items-center gap-2 cursor-pointer py-2.5 shadow-sm text-xs font-bold uppercase tracking-wider bg-white hover:bg-gray-50 border border-gray-300"
          >
            <Upload className="w-4 h-4 text-[#FF5C2B]" /> Import Menu from Excel
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Form Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Customer Details */}
          <div className="admin-card p-6 bg-white border border-gray-200 space-y-5">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-150 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF5C2B]/10 text-[#FF5C2B] text-xs flex items-center justify-center font-bold">1</span>
              Customer & Event Information
            </h2>

            {/* Quick Customer Select Dropdown */}
            {customersList.length > 0 && (
              <div className="flex flex-col border-b border-gray-100 pb-4 mb-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FF5C2B]" />
                  Select Existing Customer (Autofill details)
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  className="admin-input py-2 text-sm cursor-pointer"
                >
                  <option value="">-- Choose Customer --</option>
                  {customersList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.mobile})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 font-semibold mb-2">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 font-semibold mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit number"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 font-semibold mb-2">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 font-semibold mb-2">Event / Booking Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 font-semibold mb-2">Function Type / Occasion</label>
                <select
                  value={functionType}
                  onChange={(e) => setFunctionType(e.target.value)}
                  className="admin-input"
                >
                  {FUNCTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {functionType === 'Other Custom Function' && (
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 font-semibold mb-2">Specify Custom Function Type *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Puberty Function, Baby Shower"
                    value={customFunctionType}
                    onChange={(e) => setCustomFunctionType(e.target.value)}
                    className="admin-input"
                  />
                </div>
              )}

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 font-semibold mb-2">Bill S.No</label>
                <input
                  type="number"
                  value={sno}
                  onChange={(e) => setSno(Number(e.target.value))}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 font-semibold mb-2">Delivery / Event Venue Address *</label>
              <textarea
                rows={2}
                required
                placeholder="Full delivery location details"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="admin-input resize-none"
              />
            </div>
          </div>

          {/* Section 2: Meal Plate Sessions Billing */}
          <div className="admin-card p-6 bg-white border border-gray-200 space-y-6">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-150 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF5C2B]/10 text-[#FF5C2B] text-xs flex items-center justify-center font-bold">2</span>
              Meal Plate Sessions Configs
            </h2>

            {/* Breakfast Session Box */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-breakfast"
                    checked={hasBreakfast}
                    onChange={(e) => setHasBreakfast(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#FF5C2B] cursor-pointer"
                  />
                  <label htmlFor="chk-breakfast" className="font-bold text-gray-800 cursor-pointer">
                    Breakfast Session
                  </label>
                </div>
                {hasBreakfast && (
                  <span className="text-sm font-bold text-[#FF5C2B]">
                    Subtotal: ₹{(breakfastPeople * breakfastRate).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {hasBreakfast && (
                <div className="space-y-4">
                  {/* Counts & Rates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase mb-1.5">Plate Count (e.g. 299)</label>
                      <input
                        type="number"
                        min="0"
                        value={breakfastPeople}
                        onChange={(e) => setBreakfastPeople(Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase mb-1.5">Rate per Plate (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={breakfastRate}
                        onChange={(e) => setBreakfastRate(Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                  </div>

                  {/* Preset load dropdown */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] text-gray-400 font-semibold uppercase block">Load Preset Package / Category</label>
                    <select
                      value=""
                      onChange={(e) => {
                        handleApplyPreset('breakfast', e.target.value);
                        e.target.value = '';
                      }}
                      className="admin-input py-1.5 text-xs cursor-pointer bg-white"
                    >
                      <option value="">-- Select Preset Package or Category --</option>
                      <optgroup label="Tiffin Packages (Tiffin 1 - 20)">
                        {Object.keys(TIFFIN_MENUS).map(k => (
                          <option key={k} value={`tiffin:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Lunch Packages (Lunch 1 - 20)">
                        {Object.keys(LUNCH_MENUS).map(k => (
                          <option key={k} value={`lunch:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Dinner Packages (Dinner 1 - 26)">
                        {Object.keys(DINNER_MENUS).map(k => (
                          <option key={k} value={`dinner:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Smart Choice Packages (M1 - M5)">
                        {Object.keys(SMART_CHOICE_MENUS).map(k => (
                          <option key={k} value={`smart:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Custom Menu Categories (Adds options to checklist)">
                        {Object.keys(CATEGORY_MENUS).map(k => (
                          <option key={k} value={`cat:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Dishes select list */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase block">Select Dishes from templates</label>
                      {selectedBreakfastDishes.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedBreakfastDishes([])}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search dishes in template list..."
                        value={searchQueries.breakfast}
                        onChange={(e) => setSearchQueries({ ...searchQueries, breakfast: e.target.value })}
                        className="w-full admin-input pl-8 py-1.5 text-xs"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white divide-y divide-gray-100 admin-scrollbar">
                      {menuOptions.breakfast.filter(dish =>
                        dish.toLowerCase().includes(searchQueries.breakfast.toLowerCase())
                      ).length === 0 ? (
                        <div className="py-4 text-center text-gray-400 text-xs italic">
                          No matching dishes. Type custom dish below to add manually.
                        </div>
                      ) : (
                        menuOptions.breakfast
                          .filter(dish => dish.toLowerCase().includes(searchQueries.breakfast.toLowerCase()))
                          .map((dish) => {
                            const isSelected = selectedBreakfastDishes.includes(dish);
                            return (
                              <div
                                key={dish}
                                onClick={() => toggleDishSelection('breakfast', dish)}
                                className="flex items-center justify-between py-2 px-1 cursor-pointer hover:bg-gray-50 transition-colors"
                              >
                                <span className="text-xs text-gray-700">{dish}</span>
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    isSelected ? 'bg-[#FF5C2B] border-[#FF5C2B] text-white' : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>

                    {/* Manual add input */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Add custom dish manually..."
                        value={tempDishInput.breakfast}
                        onChange={(e) => setTempDishInput({ ...tempDishInput, breakfast: e.target.value })}
                        className="flex-1 admin-input py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNewDishPreset('breakfast')}
                        className="admin-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lunch Session Box */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-lunch"
                    checked={hasLunch}
                    onChange={(e) => setHasLunch(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#FF5C2B] cursor-pointer"
                  />
                  <label htmlFor="chk-lunch" className="font-bold text-gray-800 cursor-pointer">
                    Lunch Session
                  </label>
                </div>
                {hasLunch && (
                  <span className="text-sm font-bold text-[#FF5C2B]">
                    Subtotal: ₹{(lunchPeople * lunchRate).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {hasLunch && (
                <div className="space-y-4">
                  {/* Counts & Rates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase mb-1.5">Plate Count</label>
                      <input
                        type="number"
                        min="0"
                        value={lunchPeople}
                        onChange={(e) => setLunchPeople(Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase mb-1.5">Rate per Plate (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={lunchRate}
                        onChange={(e) => setLunchRate(Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                  </div>

                  {/* Preset load dropdown */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] text-gray-400 font-semibold uppercase block">Load Preset Package / Category</label>
                    <select
                      value=""
                      onChange={(e) => {
                        handleApplyPreset('lunch', e.target.value);
                        e.target.value = '';
                      }}
                      className="admin-input py-1.5 text-xs cursor-pointer bg-white"
                    >
                      <option value="">-- Select Preset Package or Category --</option>
                      <optgroup label="Tiffin Packages (Tiffin 1 - 20)">
                        {Object.keys(TIFFIN_MENUS).map(k => (
                          <option key={k} value={`tiffin:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Lunch Packages (Lunch 1 - 20)">
                        {Object.keys(LUNCH_MENUS).map(k => (
                          <option key={k} value={`lunch:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Dinner Packages (Dinner 1 - 26)">
                        {Object.keys(DINNER_MENUS).map(k => (
                          <option key={k} value={`dinner:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Smart Choice Packages (M1 - M5)">
                        {Object.keys(SMART_CHOICE_MENUS).map(k => (
                          <option key={k} value={`smart:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Custom Menu Categories (Adds options to checklist)">
                        {Object.keys(CATEGORY_MENUS).map(k => (
                          <option key={k} value={`cat:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Dishes select list */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase block">Select Dishes from templates</label>
                      {selectedLunchDishes.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedLunchDishes([])}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search dishes in template list..."
                        value={searchQueries.lunch}
                        onChange={(e) => setSearchQueries({ ...searchQueries, lunch: e.target.value })}
                        className="w-full admin-input pl-8 py-1.5 text-xs"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white divide-y divide-gray-100 admin-scrollbar">
                      {menuOptions.lunch.filter(dish =>
                        dish.toLowerCase().includes(searchQueries.lunch.toLowerCase())
                      ).length === 0 ? (
                        <div className="py-4 text-center text-gray-400 text-xs italic">
                          No matching dishes. Type custom dish below to add manually.
                        </div>
                      ) : (
                        menuOptions.lunch
                          .filter(dish => dish.toLowerCase().includes(searchQueries.lunch.toLowerCase()))
                          .map((dish) => {
                            const isSelected = selectedLunchDishes.includes(dish);
                            return (
                              <div
                                key={dish}
                                onClick={() => toggleDishSelection('lunch', dish)}
                                className="flex items-center justify-between py-2 px-1 cursor-pointer hover:bg-gray-50 transition-colors"
                              >
                                <span className="text-xs text-gray-700">{dish}</span>
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    isSelected ? 'bg-[#FF5C2B] border-[#FF5C2B] text-white' : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>

                    {/* Manual add input */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Add custom dish manually..."
                        value={tempDishInput.lunch}
                        onChange={(e) => setTempDishInput({ ...tempDishInput, lunch: e.target.value })}
                        className="flex-1 admin-input py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNewDishPreset('lunch')}
                        className="admin-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dinner Session Box */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-dinner"
                    checked={hasDinner}
                    onChange={(e) => setHasDinner(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#FF5C2B] cursor-pointer"
                  />
                  <label htmlFor="chk-dinner" className="font-bold text-gray-800 cursor-pointer">
                    Dinner Session
                  </label>
                </div>
                {hasDinner && (
                  <span className="text-sm font-bold text-[#FF5C2B]">
                    Subtotal: ₹{(dinnerPeople * dinnerRate).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {hasDinner && (
                <div className="space-y-4">
                  {/* Counts & Rates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase mb-1.5">Plate Count (e.g. 299)</label>
                      <input
                        type="number"
                        min="0"
                        value={dinnerPeople}
                        onChange={(e) => setDinnerPeople(Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase mb-1.5">Rate per Plate (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={dinnerRate}
                        onChange={(e) => setDinnerRate(Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                  </div>

                  {/* Preset load dropdown */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] text-gray-400 font-semibold uppercase block">Load Preset Package / Category</label>
                    <select
                      value=""
                      onChange={(e) => {
                        handleApplyPreset('dinner', e.target.value);
                        e.target.value = '';
                      }}
                      className="admin-input py-1.5 text-xs cursor-pointer bg-white"
                    >
                      <option value="">-- Select Preset Package or Category --</option>
                      <optgroup label="Tiffin Packages (Tiffin 1 - 20)">
                        {Object.keys(TIFFIN_MENUS).map(k => (
                          <option key={k} value={`tiffin:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Lunch Packages (Lunch 1 - 20)">
                        {Object.keys(LUNCH_MENUS).map(k => (
                          <option key={k} value={`lunch:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Dinner Packages (Dinner 1 - 26)">
                        {Object.keys(DINNER_MENUS).map(k => (
                          <option key={k} value={`dinner:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Smart Choice Packages (M1 - M5)">
                        {Object.keys(SMART_CHOICE_MENUS).map(k => (
                          <option key={k} value={`smart:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Custom Menu Categories (Adds options to checklist)">
                        {Object.keys(CATEGORY_MENUS).map(k => (
                          <option key={k} value={`cat:${k}`}>{k}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Dishes select list */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-gray-400 font-semibold uppercase block">Select Dishes from templates</label>
                      {selectedDinnerDishes.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedDinnerDishes([])}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search dishes in template list..."
                        value={searchQueries.dinner}
                        onChange={(e) => setSearchQueries({ ...searchQueries, dinner: e.target.value })}
                        className="w-full admin-input pl-8 py-1.5 text-xs"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white divide-y divide-gray-100 admin-scrollbar">
                      {menuOptions.dinner.filter(dish =>
                        dish.toLowerCase().includes(searchQueries.dinner.toLowerCase())
                      ).length === 0 ? (
                        <div className="py-4 text-center text-gray-400 text-xs italic">
                          No matching dishes. Type custom dish below to add manually.
                        </div>
                      ) : (
                        menuOptions.dinner
                          .filter(dish => dish.toLowerCase().includes(searchQueries.dinner.toLowerCase()))
                          .map((dish) => {
                            const isSelected = selectedDinnerDishes.includes(dish);
                            return (
                              <div
                                key={dish}
                                onClick={() => toggleDishSelection('dinner', dish)}
                                className="flex items-center justify-between py-2 px-1 cursor-pointer hover:bg-gray-50 transition-colors"
                              >
                                <span className="text-xs text-gray-700">{dish}</span>
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    isSelected ? 'bg-[#FF5C2B] border-[#FF5C2B] text-white' : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>

                    {/* Manual add input */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Add custom dish manually..."
                        value={tempDishInput.dinner}
                        onChange={(e) => setTempDishInput({ ...tempDishInput, dinner: e.target.value })}
                        className="flex-1 admin-input py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNewDishPreset('dinner')}
                        className="admin-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Live Food Stalls & Welcome Drinks */}
          <div className="admin-card p-6 bg-white border border-gray-200 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5C2B]/10 text-[#FF5C2B] text-xs flex items-center justify-center font-bold">3</span>
                Stalls & Live Counters setup
              </h2>
              <button
                type="button"
                onClick={handleAddStall}
                className="inline-flex items-center gap-1 text-[#FF5C2B] hover:text-[#e04618] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Add Stall / Counter
              </button>
            </div>

            {stalls.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-xs">
                No stalls or counters added. Click 'Add Stall / Counter' if needed.
              </div>
            ) : (
              <div className="space-y-6 divide-y divide-gray-100">
                {stalls.map((stall, index) => {
                  const stallCost =
                    stall.pricingType === 'plates' ? stall.people * stall.rate : stall.fixedPrice;
                  return (
                    <div key={stall.id} className="pt-5 first:pt-0 space-y-4">
                      {/* Title & Delete Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            placeholder="Stall name (e.g. Welcome Drinks)"
                            value={stall.name}
                            onChange={(e) => handleUpdateStallField(stall.id, 'name', e.target.value)}
                            className="w-full admin-input py-1.5 font-semibold text-gray-800 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#FF5C2B]">
                            Cost: ₹{stallCost.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStall(stall.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Config Columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                        {/* Cost Type Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5">Billing Logic</label>
                          <select
                            value={stall.pricingType}
                            onChange={(e) => handleUpdateStallField(stall.id, 'pricingType', e.target.value)}
                            className="admin-input py-1.5 text-xs cursor-pointer"
                          >
                            <option value="plates">Plates Count (Multiplied)</option>
                            <option value="fixed">Rs Count (Lump Sum / Fixed Price)</option>
                          </select>
                        </div>

                        {/* Condition Inputs */}
                        {stall.pricingType === 'plates' ? (
                          <>
                            <div className="flex flex-col">
                              <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5">Plates count</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  value={stall.people}
                                  onChange={(e) => handleUpdateStallField(stall.id, 'people', Number(e.target.value))}
                                  className="w-full admin-input py-1.5 text-xs pr-8"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                                  PLT
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5">Rate Per Plate (₹)</label>
                              <input
                                type="number"
                                min="0"
                                value={stall.rate}
                                onChange={(e) => handleUpdateStallField(stall.id, 'rate', Number(e.target.value))}
                                className="admin-input py-1.5 text-xs text-right"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col sm:col-span-2">
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5">Fixed Price (Rs Count)</label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                placeholder="Lump sum amount"
                                value={stall.fixedPrice}
                                onChange={(e) => handleUpdateStallField(stall.id, 'fixedPrice', Number(e.target.value))}
                                className="w-full admin-input py-1.5 text-xs text-right pr-8"
                              />
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                RS
                              </span>
                            </div>
                          </div>
                        )}
                      {/* Stall items select panel */}
                      <div className="space-y-2 col-span-1 sm:col-span-3 border-t border-gray-150 pt-3 mt-1">
                        {/* Quick load presets dropdown */}
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] text-gray-500 font-bold uppercase">Load Preset Package / Category (Adds items to Stall)</label>
                          <select
                            value=""
                            onChange={(e) => {
                              handleApplyStallPreset(stall.id, e.target.value);
                              e.target.value = '';
                            }}
                            className="admin-input py-1 text-xs cursor-pointer bg-white"
                          >
                            <option value="">-- Select Preset Package or Category --</option>
                            <optgroup label="Tiffin Packages">
                              {Object.keys(TIFFIN_MENUS).map(k => (
                                <option key={k} value={`tiffin:${k}`}>{k}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Lunch Packages">
                              {Object.keys(LUNCH_MENUS).map(k => (
                                <option key={k} value={`lunch:${k}`}>{k}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Dinner Packages">
                              {Object.keys(DINNER_MENUS).map(k => (
                                <option key={k} value={`dinner:${k}`}>{k}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Smart Choice Packages">
                              {Object.keys(SMART_CHOICE_MENUS).map(k => (
                                <option key={k} value={`smart:${k}`}>{k}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Custom Categories">
                              {Object.keys(CATEGORY_MENUS).map(k => (
                                <option key={k} value={`cat:${k}`}>{k}</option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-[11px] text-gray-400 font-semibold uppercase block">Select Menu for Stalls</label>
                          {stall.selectedDishes.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setStalls(prev => prev.map(s => s.id === stall.id ? { ...s, selectedDishes: [] } : s));
                              }}
                              className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                            >
                              Clear Selection
                            </button>
                          )}
                        </div>

                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400">
                            <Search className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="text"
                            placeholder="Search stall template items..."
                            value={searchQueries.stalls}
                            onChange={(e) => setSearchQueries({ ...searchQueries, stalls: e.target.value })}
                            className="w-full admin-input pl-7.5 py-1 text-xs"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white admin-scrollbar">
                          {menuOptions.stalls.filter(dish =>
                            dish.toLowerCase().includes(searchQueries.stalls.toLowerCase())
                          ).length === 0 ? (
                            <div className="py-2 text-center text-gray-400 text-xs italic w-full">
                              No matching stall items. Type below to add manually.
                            </div>
                          ) : (
                            menuOptions.stalls
                              .filter(dish => dish.toLowerCase().includes(searchQueries.stalls.toLowerCase()))
                              .map((dish) => {
                                const isSelected = stall.selectedDishes.includes(dish);
                                return (
                                  <button
                                    type="button"
                                    key={dish}
                                    onClick={() => toggleStallDish(stall.id, dish)}
                                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#FF5C2B] border-[#FF5C2B] text-white font-medium'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                  >
                                    {dish}
                                  </button>
                                );
                              })
                          )}
                        </div>

                        {/* Manual Add Input for Stall Items */}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            id={`stall-add-${stall.id}`}
                            placeholder="Type custom stall menu item..."
                            className="flex-1 admin-input py-1.5 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`stall-add-${stall.id}`);
                              const val = input ? input.value.trim() : '';
                              if (val) {
                                if (!menuOptions.stalls.includes(val)) {
                                  setMenuOptions((prev) => ({
                                    ...prev,
                                    stalls: [...prev.stalls, val]
                                  }));
                                }
                                toggleStallDish(stall.id, val);
                                if (input) input.value = '';
                              }
                            }}
                            className="admin-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Stall Item
                          </button>
                        </div>
                      </div>
                    </div>                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Extra Charges */}
          <div className="admin-card p-6 bg-white border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5C2B]/10 text-[#FF5C2B] text-xs flex items-center justify-center font-bold">4</span>
                Extra Logistics Charges
              </h2>
              <button
                type="button"
                onClick={handleAddExtraCharge}
                className="inline-flex items-center gap-1 text-[#FF5C2B] hover:text-[#e04618] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Add Charge
              </button>
            </div>

            {extraCharges.length === 0 ? (
              <div className="py-4 text-center text-gray-400 text-xs">
                No logistics or service charges configured.
              </div>
            ) : (
              <div className="space-y-3">
                {extraCharges.map((charge) => (
                  <div key={charge.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Transport Logistics, Extra Cleaning fee"
                        value={charge.label}
                        onChange={(e) => handleExtraChargeChange(charge.id, 'label', e.target.value)}
                        className="w-full admin-input py-1.5"
                      />
                    </div>

                    <div className="w-36">
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="Amount"
                        value={charge.amount}
                        onChange={(e) => handleExtraChargeChange(charge.id, 'amount', e.target.value)}
                        className="w-full admin-input py-1.5 text-right font-medium"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExtraCharge(charge.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Columns */}
        <div className="space-y-6">
          
          {/* Bill settings card */}
          <div className="admin-card p-6 bg-white border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-150 pb-3">Bill Settings</h2>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 font-semibold mb-2">Invoice Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="admin-input cursor-pointer"
              >
                <option value="Draft">Draft (Unsaved/Unsent)</option>
                <option value="Sent">Sent to Customer</option>
                <option value="Paid">Paid / Settled</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 font-semibold mb-2">GST Rate (%)</label>
              <select
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                className="admin-input cursor-pointer"
              >
                <option value="0">0% (GST Exempt)</option>
                <option value="5">5% (Catering Rate)</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 font-semibold mb-2">Billing Terms & Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="admin-input resize-none text-xs"
              />
            </div>
          </div>

          {/* Pricing Totals Card */}
          <div className="admin-card p-6 bg-white border-2 border-[#FF5C2B]/10 space-y-5 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-150 pb-3">Bill Summary</h2>

            <div className="space-y-3.5 text-xs text-gray-600">
              {/* Detailed meal splits */}
              {hasBreakfast && (
                <div className="flex justify-between">
                  <span>Breakfast ({breakfastPeople} plts)</span>
                  <span className="font-semibold text-gray-800">₹{(breakfastPeople * breakfastRate).toLocaleString('en-IN')}</span>
                </div>
              )}
              {hasLunch && (
                <div className="flex justify-between">
                  <span>Lunch ({lunchPeople} plts)</span>
                  <span className="font-semibold text-gray-800">₹{(lunchPeople * lunchRate).toLocaleString('en-IN')}</span>
                </div>
              )}
              {hasDinner && (
                <div className="flex justify-between">
                  <span>Dinner ({dinnerPeople} plts)</span>
                  <span className="font-semibold text-gray-800">₹{(dinnerPeople * dinnerRate).toLocaleString('en-IN')}</span>
                </div>
              )}
              
              {/* Stalls cost summary */}
              {stalls.length > 0 && (
                <div className="flex justify-between border-t border-gray-100 pt-2">
                  <span>Food Stalls Total</span>
                  <span className="font-semibold text-gray-800">
                    ₹{stalls
                      .reduce((sum, s) => sum + (s.pricingType === 'plates' ? s.people * s.rate : s.fixedPrice), 0)
                      .toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* Extras cost summary */}
              {extraCharges.length > 0 && (
                <div className="flex justify-between">
                  <span>Extra Charges</span>
                  <span className="font-semibold text-gray-800">
                    ₹{extraCharges.reduce((sum, ec) => sum + (Number(ec.amount) || 0), 0).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* Subtotal & taxes */}
              <div className="border-t border-gray-250 pt-3 flex justify-between font-bold text-sm text-gray-800">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between">
                <span>GST ({gstPercent}%)</span>
                <span className="font-semibold text-gray-800">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="border-t border-gray-250 pt-3.5 flex justify-between items-baseline">
                <span className="text-sm text-gray-850 font-bold">Grand Total</span>
                <span className="text-2xl font-black text-[#FF5C2B]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Log Ledger */}
              <div className="border-t-2 border-dashed border-gray-250 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Payment Ledger log</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 font-bold mb-1">Advance Paid (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(Number(e.target.value))}
                      className="admin-input py-1 text-xs text-right font-medium"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 font-bold mb-1">Advance Date</label>
                    <input
                      type="date"
                      value={advancePaidDate}
                      onChange={(e) => setAdvancePaidDate(e.target.value)}
                      className="admin-input py-1 text-xs font-medium cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 font-bold mb-1">Next Payment (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      className="admin-input py-1 text-xs text-right font-medium"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 font-bold mb-1">Next Pay Date</label>
                    <input
                      type="date"
                      value={amountPaidDate}
                      onChange={(e) => setAmountPaidDate(e.target.value)}
                      className="admin-input py-1 text-xs font-medium cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-250 space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Total Paid</span>
                    <span className="font-semibold text-gray-800">
                      ₹{((Number(advancePaid) || 0) + (Number(amountPaid) || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1.5 border-t border-gray-200">
                    <span className="text-xs font-bold text-gray-700">Balance Pending</span>
                    <span className={`text-base font-black ${
                      (grandTotal - (Number(advancePaid) || 0) - (Number(amountPaid) || 0)) > 0
                        ? 'text-[#FF5C2B]'
                        : 'text-green-600'
                    }`}>
                      ₹{Math.max(0, grandTotal - (Number(advancePaid) || 0) - (Number(amountPaid) || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full admin-btn-primary flex items-center justify-center gap-2 cursor-pointer py-3"
              >
                <Save className="w-5 h-5" />
                {isEditMode ? 'Update Bill Details' : 'Save & Close Invoice'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
