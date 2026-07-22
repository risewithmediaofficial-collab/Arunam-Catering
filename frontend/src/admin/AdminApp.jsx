import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const AdminLogin = lazy(() => import('./AdminLogin'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const BillForm = lazy(() => import('./BillForm'));
const BillPrint = lazy(() => import('./BillPrint'));
const AdminCustomers = lazy(() => import('./AdminCustomers'));
const AdminEnquiries = lazy(() => import('./AdminEnquiries'));

function AdminPageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-[#FF5C2B]/20 border-t-[#FF5C2B] rounded-full animate-spin mb-3" />
      <span className="text-xs font-semibold text-gray-500">Loading...</span>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Suspense fallback={<AdminPageLoader />}>
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
        <Route
          path="customers"
          element={
            <AdminLayout>
              <AdminCustomers />
            </AdminLayout>
          }
        />
        <Route
          path="enquiries"
          element={
            <AdminLayout>
              <AdminEnquiries />
            </AdminLayout>
          }
        />
        <Route path="bill/:id/print" element={<BillPrint />} />
      </Routes>
    </Suspense>
  );
}
