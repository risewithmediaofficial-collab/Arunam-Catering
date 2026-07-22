import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { isLoggedIn, logout, getAdminName } from './adminAuth';
import { LayoutDashboard, FileSpreadsheet, Users, Inbox, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import './admin.css';

import useLockBodyScroll from '../hooks/useLockBodyScroll';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');

  // Lock background scroll when mobile sidebar drawer is active
  useLockBodyScroll(sidebarOpen);

  // Authentication Guard
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin/login');
    } else {
      setAdminName(getAdminName() || 'Admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'New Bill',
      path: '/admin/bill/new',
      icon: FileSpreadsheet,
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: Users,
    },
    {
      name: 'Enquiries',
      path: '/admin/enquiries',
      icon: Inbox,
    },
  ];

  return (
    <div className="admin-body min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-3.5 px-4 bg-[#ffffff] border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <Link to="/" className="flex items-center gap-2">
          <img src="/arunam_logo.png" alt="Arunam Logo" className="h-9 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">{adminName}</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-[#ffffff] border-r border-gray-200 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand logo */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/arunam_logo.png" alt="Arunam Logo" className="h-11 w-auto object-contain" />
          </Link>
          <button className="md:hidden p-1.5 text-gray-500 hover:text-black" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-3.5 mx-4 my-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Signed In As</p>
          <p className="text-xs font-bold text-gray-800 truncate capitalize mt-0.5">{adminName}</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF5C2B] text-white shadow-md shadow-[#FF5C2B]/15'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom options */}
        <div className="p-3 border-t border-gray-200 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden bg-[#fcfbfa]">
        {children}
      </main>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
