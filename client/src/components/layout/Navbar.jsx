import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { notificationsAPI } from '../../services/api';
import { FiMenu, FiX, FiUser, FiBell, FiMessageSquare, FiMapPin, FiSearch, FiLogOut, FiGrid, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount: socketUnreadCount, resetUnreadCount } = useSocket();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      const fetchCount = async () => {
        try {
          const { data } = await notificationsAPI.getUnreadCount({ skipAuthRedirect: true });
          setUnreadCount(data.count || 0);
        } catch {}
      };
      fetchCount();
      const interval = setInterval(fetchCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (socketUnreadCount > 0) {
      setUnreadCount(socketUnreadCount);
    }
  }, [socketUnreadCount]);

  useEffect(() => {
    if (resetUnreadCount) resetUnreadCount();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <img src="/markiit%20logo.svg" alt="Markiit" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight text-white">Markiit</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/products" className="text-sm font-medium text-white/90 hover:text-white no-underline transition-colors">
                Products
              </Link>
              <Link to="/services" className="text-sm font-medium text-white/90 hover:text-white no-underline transition-colors">
                Services
              </Link>
              <Link to="/nearby" className="text-sm font-medium text-white/90 hover:text-white no-underline transition-colors flex items-center gap-1">
                <FiMapPin size={14} /> Nearby
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/messages" className="text-white/90 hover:text-white transition-colors relative">
                  <FiMessageSquare size={20} />
                </Link>
                <Link to="/notifications/all" className="text-white/90 hover:text-white transition-colors relative">
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-white/90 hover:text-white bg-transparent border-none cursor-pointer text-sm"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <FiUser size={16} />
                      </div>
                    )}
                    <FiChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-semibold text-charcoal">{user.name}</p>
                        <p className="text-xs text-charcoal-light">{user.email}</p>
                      </div>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-charcoal hover:bg-neutral no-underline" onClick={() => setDropdownOpen(false)}>
                        My Dashboard
                      </Link>
                      <Link to={`/profile/${user._id}`} className="block px-4 py-2 text-sm text-charcoal hover:bg-neutral no-underline" onClick={() => setDropdownOpen(false)}>
                        My Profile
                      </Link>
                      <Link to="/my-listings" className="block px-4 py-2 text-sm text-charcoal hover:bg-neutral no-underline" onClick={() => setDropdownOpen(false)}>
                        My Listings
                      </Link>
                      <Link to="/favorites" className="block px-4 py-2 text-sm text-charcoal hover:bg-neutral no-underline" onClick={() => setDropdownOpen(false)}>
                        Favorites
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/system-access-portal" className="block px-4 py-2 text-sm text-charcoal hover:bg-neutral no-underline" onClick={() => setDropdownOpen(false)}>
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 bg-transparent border-none cursor-pointer flex items-center gap-2">
                        <FiLogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/90 hover:text-white no-underline">
                  Login
                </Link>
                <Link to="/register" className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark no-underline transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 pb-4">
          <div className="px-4 pt-2 space-y-2">
            <Link to="/products" className="block py-2 text-white/90 no-underline" onClick={() => setMobileOpen(false)}>Products</Link>
            <Link to="/services" className="block py-2 text-white/90 no-underline" onClick={() => setMobileOpen(false)}>Services</Link>
            <Link to="/nearby" className="block py-2 text-white/90 no-underline" onClick={() => setMobileOpen(false)}>Nearby</Link>
            {user ? (
              <>
                <Link to="/messages" className="block py-2 text-white/90 no-underline" onClick={() => setMobileOpen(false)}>Messages</Link>
                <Link to="/notifications/all" className="block py-2 text-white/90 no-underline" onClick={() => setMobileOpen(false)}>Notifications {unreadCount > 0 && `(${unreadCount})`}</Link>
                <Link to="/dashboard" className="block py-2 text-white/90 no-underline" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="block py-2 text-accent bg-transparent border-none cursor-pointer text-left w-full">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-white/90 no-underline" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 text-accent font-semibold no-underline" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
