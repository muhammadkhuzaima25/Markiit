import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiUsers,
  FiPackage,
  FiAlertTriangle,
  FiLogOut,
  FiMenu,
  FiX,
  FiArrowLeft,
} from 'react-icons/fi';

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/users', icon: FiUsers, label: 'Manage Users' },
  { to: '/admin/listings', icon: FiPackage, label: 'Manage Listings' },
  { to: '/admin/reports', icon: FiAlertTriangle, label: 'Reported Content' },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
      isActive
        ? 'bg-accent/15 text-accent'
        : 'text-white/70 hover:text-white hover:bg-white/10'
    }`;

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <img src="/markiit%20logo.svg" alt="M" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Markiit</h1>
            <p className="text-xs text-white/50">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 no-underline"
          onClick={() => setSidebarOpen(false)}
        >
          <FiArrowLeft size={18} />
          Back to Site
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-white/10 transition-all duration-200 border-none bg-transparent cursor-pointer"
        >
          <FiLogOut size={18} />
          Logout
        </button>
        {user && (
          <div className="px-4 py-2 mt-2 rounded-lg bg-white/5">
            <p className="text-xs text-white/60 truncate">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral flex">
      <aside className="hidden lg:flex w-64 bg-primary flex-col fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-primary h-full flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-transparent border-none cursor-pointer"
            >
              <FiX size={20} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 min-h-screen overflow-x-hidden">
        <header className="bg-white border-b border-border sticky top-0 z-20 px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-charcoal bg-transparent border-none cursor-pointer"
          >
            <FiMenu size={22} />
          </button>
          <h2 className="text-sm font-semibold text-charcoal">Admin Dashboard</h2>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
