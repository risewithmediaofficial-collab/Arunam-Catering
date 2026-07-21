import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with Smart Port Fallback (27017 <-> 27020)
const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arunam';
const fallbackUri = primaryUri.includes('27020')
  ? primaryUri.replace('27020', '27017')
  : primaryUri.replace('27017', '27020');

async function connectMongoDB() {
  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`Connected successfully to MongoDB at ${primaryUri}`);
  } catch (err) {
    console.warn(`Could not connect to primary MongoDB (${primaryUri}): ${err.message}`);
    console.log(`Attempting fallback MongoDB port (${fallbackUri})...`);
    try {
      await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`Connected successfully to fallback MongoDB at ${fallbackUri}`);
    } catch (fallbackErr) {
      console.error('MongoDB connection notice: Local MongoDB server is not running on port 27017 or 27020.');
      console.log('To start MongoDB on Windows: run `mongod` or start MongoDB Windows Service.');
    }
  }
}

connectMongoDB();


// Mongoose Schema
const billSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    sno: Number,
    customer: {
      name: String,
      address: String,
      mobile: String,
      email: String,
    },
    eventDate: String,
    functionType: String,
    status: String,
    notes: String,
    menuOptions: mongoose.Schema.Types.Mixed,
    
    // Sessions
    hasBreakfast: Boolean,
    breakfastPeople: Number,
    breakfastRate: Number,
    selectedBreakfastDishes: [String],
    
    hasLunch: Boolean,
    lunchPeople: Number,
    lunchRate: Number,
    selectedLunchDishes: [String],
    
    hasDinner: Boolean,
    dinnerPeople: Number,
    dinnerRate: Number,
    selectedDinnerDishes: [String],

    // Stalls & Extras
    stalls: [mongoose.Schema.Types.Mixed],
    extraCharges: [mongoose.Schema.Types.Mixed],
    subtotal: Number,
    gstPercent: Number,
    gstAmount: Number,
    grandTotal: Number,
    
    // Payment Log/Ledger
    advancePaid: { type: Number, default: 0 },
    advancePaidDate: { type: String, default: '' },
    amountPaid: { type: Number, default: 0 },
    amountPaidDate: { type: String, default: '' },
    balancePending: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Bill = mongoose.model('Bill', billSchema);

// Customer Schema
const customerSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    mobile: String,
    email: String,
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

// REST API Endpoints

// 0. Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Arunam Catering Services API is fully active!',
    endpoints: {
      getAllBills: 'GET /api/bills',
      getBillById: 'GET /api/bills/:id',
      saveBill: 'POST /api/bills',
      deleteBill: 'DELETE /api/bills/:id'
    }
  });
});

// 1. Get all bills (sorted by createdAt/updatedAt descending)
app.get('/api/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ updatedAt: -1, createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bills', error: error.message });
  }
});

// 2. Get single bill by unique UUID id
app.get('/api/bills/:id', async (req, res) => {
  try {
    const bill = await Bill.findOne({ id: req.params.id });
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bill', error: error.message });
  }
});

// 3. Create or Update a bill
app.post('/api/bills', async (req, res) => {
  try {
    const billData = req.body;
    let bill;

    if (billData.id) {
      // Check if it already exists
      bill = await Bill.findOne({ id: billData.id });
    }

    if (bill) {
      // Update existing
      Object.assign(bill, billData);
      await bill.save();
    } else {
      // Auto-assign S.No if not provided or 0
      if (!billData.sno) {
        const lastBill = await Bill.findOne().sort({ sno: -1 });
        billData.sno = lastBill ? lastBill.sno + 1 : 1;
      }
      if (!billData.id) {
        billData.id = crypto.randomUUID();
      }
      // Create new
      bill = new Bill(billData);
      await bill.save();
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Error saving bill', error: error.message });
  }
});

// 4. Delete a bill
app.delete('/api/bills/:id', async (req, res) => {
  try {
    const result = await Bill.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ success: true, message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bill', error: error.message });
  }
});

// ─────────────────────────────────────────────
// CUSTOMER API ENDPOINTS
// ─────────────────────────────────────────────

// 1. Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving customers', error: error.message });
  }
});

// 2. Create or Update a customer
app.post('/api/customers', async (req, res) => {
  try {
    const customerData = req.body;
    let customer;

    // Remove empty/null _id to prevent Mongoose CastError on creation
    if (!customerData._id || customerData._id === '' || customerData._id === 'null' || customerData._id === 'undefined') {
      delete customerData._id;
    }

    if (customerData._id) {
      customer = await Customer.findById(customerData._id);
    }

    if (customer) {
      Object.assign(customer, customerData);
      await customer.save();
    } else {
      customer = new Customer(customerData);
      await customer.save();
    }

    res.json(customer);
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ message: 'Error saving customer', error: error.message });
  }
});


// 3. Delete a customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const result = await Customer.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
