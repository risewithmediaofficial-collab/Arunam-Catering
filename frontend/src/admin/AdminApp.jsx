import { Routes, Route } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import BillForm from './BillForm';
import BillPrint from './BillPrint';

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path=""
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="bill/new"
        element={
          <AdminLayout>
            <BillForm />
          </AdminLayout>
        }
      />
      <Route
        path="bill/edit/:id"
        element={
          <AdminLayout>
            <BillForm />
          </AdminLayout>
        }
      />
      <Route path="bill/:id/print" element={<BillPrint />} />
    </Routes>
  );
}
