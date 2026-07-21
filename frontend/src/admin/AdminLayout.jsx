import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { isLoggedIn, logout, getAdminName } from './adminAuth';
import { LayoutDashboard, FileSpreadsheet, Users, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import './admin.css';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');

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
  ];

  return (
    <div className="admin-body min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#ffffff] border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <img src="/arunam_logo.png" alt="Arunam Logo" className="h-10 w-auto object-contain" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-500 hover:text-black"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-[#ffffff] border-r border-gray-250 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/arunam_logo.png" alt="Arunam Logo" className="h-12 w-auto object-contain" />
          </Link>
          <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 mx-4 my-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Signed In As</p>
          <p className="text-sm font-medium text-gray-700 truncate capitalize mt-0.5">{adminName}</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF5C2B] text-white shadow-md shadow-[#FF5C2B]/10'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom options */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full admin-scrollbar overflow-y-auto bg-[#fcfbfa]">
        {children}
      </main>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
