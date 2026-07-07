import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';
import {
  FiGrid,
  FiPackage,
  FiCalendar,
  FiMessageSquare,
  FiHeart,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSearch,
} from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/my-listings', icon: FiPackage, label: 'My Listings' },
  { to: '/bookings', icon: FiCalendar, label: 'Bookings' },
  { to: '/messages', icon: FiMessageSquare, label: 'Messages' },
  { to: '/favorites', icon: FiHeart, label: 'Favorites' },
  { to: '/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/profile', icon: FiUser, label: 'My Profile' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

const UserLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await notificationsAPI.getUnreadCount();
        setUnreadCount(data.count || 0);
      } catch {}
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
      isActive
        ? 'bg-accent/15 text-accent border-l-4 border-accent'
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
            <p className="text-xs text-white/50">User Dashboard</p>
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-primary flex-col fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile Sidebar Overlay */}
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

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen overflow-x-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-border sticky top-0 z-20 px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-charcoal bg-transparent border-none cursor-pointer"
            >
              <FiMenu size={22} />
            </button>
            <div className="relative hidden sm:block">
              <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
              <input
                type="text"
                placeholder="Search listings, services..."
                className="w-64 pl-9 pr-4 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 text-charcoal-light hover:text-charcoal rounded-lg hover:bg-neutral transition-colors"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral transition-colors"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-charcoal hidden sm:block">{user?.name?.split(' ')[0] || 'User'}</span>
                <FiChevronDown size={14} className="text-charcoal-light" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-charcoal hover:bg-neutral"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/edit-profile"
                    className="block px-4 py-2 text-sm text-charcoal hover:bg-neutral"
                    onClick={() => setProfileOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;