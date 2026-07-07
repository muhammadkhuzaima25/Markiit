import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productsAPI, servicesAPI, bookingsAPI } from '../../services/api';
import { FiPackage, FiCalendar, FiHeart, FiDollarSign, FiPlus, FiEdit } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, services: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, servRes, bookRes] = await Promise.all([
          productsAPI.getMy(), servicesAPI.getMy(), bookingsAPI.getMy()
        ]);
        setStats({
          products: prodRes.data.products?.length || prodRes.data.data?.length || 0,
          services: servRes.data.services?.length || servRes.data.data?.length || 0,
          bookings: bookRes.data.bookings?.length || bookRes.data.data?.length || 0,
        });
      } catch {}
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: FiPackage, label: 'My Products', value: stats.products, link: '/my-listings', color: 'bg-blue-50 text-blue-600' },
    { icon: FiPackage, label: 'My Services', value: stats.services, link: '/my-listings', color: 'bg-purple-50 text-purple-600' },
    { icon: FiCalendar, label: 'My Bookings', value: stats.bookings, link: '/bookings', color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Welcome, {user?.name}</h1>
          <p className="text-charcoal-light mt-1">Manage your listings, bookings, and account</p>
        </div>
        <div className="flex gap-2">
          <Link to="/products/create" className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark no-underline flex items-center gap-1 transition-colors">
            <FiPlus size={16} /> New Product
          </Link>
          <Link to="/services/create" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-light no-underline flex items-center gap-1 transition-colors">
            <FiPlus size={16} /> New Service
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow no-underline group">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-charcoal">{card.value}</p>
            <p className="text-sm text-charcoal-light">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-charcoal mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/my-listings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral no-underline text-charcoal transition-colors">
              <FiPackage size={18} className="text-primary" /> <span className="text-sm">Manage My Listings</span>
            </Link>
            <Link to="/bookings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral no-underline text-charcoal transition-colors">
              <FiCalendar size={18} className="text-primary" /> <span className="text-sm">View Bookings</span>
            </Link>
            <Link to="/favorites" className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral no-underline text-charcoal transition-colors">
              <FiHeart size={18} className="text-primary" /> <span className="text-sm">My Favorites</span>
            </Link>
            <Link to="/edit-profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral no-underline text-charcoal transition-colors">
              <FiEdit size={18} className="text-primary" /> <span className="text-sm">Edit Profile</span>
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-charcoal mb-4">Account Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-charcoal-light">Name</span><span className="text-charcoal font-medium">{user?.name}</span></div>
            <div className="flex justify-between"><span className="text-charcoal-light">Email</span><span className="text-charcoal font-medium">{user?.email}</span></div>
            <div className="flex justify-between"><span className="text-charcoal-light">Location</span><span className="text-charcoal font-medium">{user?.locationName || 'Not set'}</span></div>
            <div className="flex justify-between"><span className="text-charcoal-light">Member Since</span><span className="text-charcoal font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span></div>
          </div>
          <Link to="/edit-profile" className="block mt-4 text-center text-sm text-primary font-medium hover:underline">Edit Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
