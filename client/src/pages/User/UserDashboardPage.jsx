import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productsAPI, servicesAPI, bookingsAPI } from '../../services/api';
import { FiPackage, FiCalendar, FiHeart, FiPlus } from 'react-icons/fi';
import UserLayout from '../../components/layout/UserLayout';

const StatCard = ({ icon: Icon, label, value, link }) => (
  <Link to={link} className="bg-white rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow duration-200 no-underline">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-2xl font-bold text-charcoal">{value}</p>
        <p className="text-sm text-charcoal-light mt-1">{label}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-accent" />
      </div>
    </div>
  </Link>
);


const UserDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, services: 0, bookings: 0, favorites: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, servRes, bookRes, favRes] = await Promise.all([
          productsAPI.getMy(),
          servicesAPI.getMy(),
          bookingsAPI.getMy(),
          productsAPI.getFavorites(),
        ]);
        const prodData = prodRes.data;
        const servData = servRes.data;
        const bookData = bookRes.data;
        const favData = favRes.data;
        const prods = Array.isArray(prodData) ? prodData : (prodData.products || prodData.data || []);
        const servs = Array.isArray(servData) ? servData : (servData.services || servData.data || []);
        const books = Array.isArray(bookData) ? bookData : (bookData.bookings || bookData.data || []);
        const favs = Array.isArray(favData) ? favData : (favData.products || favData.data || []);
        setStats({
          products: prods.length,
          services: servs.length,
          bookings: books.length,
          favorites: favs.length,
        });
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: FiPackage, label: 'Active Listings', value: stats.products + stats.services, link: '/my-listings' },
    { icon: FiCalendar, label: 'Pending Bookings', value: stats.bookings, link: '/bookings' },
    { icon: FiHeart, label: 'Favorites', value: stats.favorites, link: '/favorites' },
  ];

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Welcome, {user?.name}</h1>
            <p className="text-sm text-charcoal-light mt-1">Manage your listings, bookings, and account</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/products/create"
              className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark no-underline flex items-center gap-1 transition-colors"
            >
              <FiPlus size={16} /> New Product
            </Link>
            <Link
              to="/services/create"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-light no-underline flex items-center gap-1 transition-colors"
            >
              <FiPlus size={16} /> New Service
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Browse Marketplace */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-base font-semibold text-charcoal mb-4">Browse Marketplace</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/products"
              className="flex items-center justify-between p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors no-underline group"
            >
              <div>
                <p className="font-semibold text-charcoal group-hover:text-primary transition-colors">View All Products</p>
                <p className="text-sm text-charcoal-light mt-0.5">Explore what's available in the market</p>
              </div>
              <FiPackage size={24} className="text-primary" />
            </Link>
            <Link
              to="/services"
              className="flex items-center justify-between p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors no-underline group"
            >
              <div>
                <p className="font-semibold text-charcoal group-hover:text-accent transition-colors">View All Services</p>
                <p className="text-sm text-charcoal-light mt-0.5">Find services near you</p>
              </div>
              <FiCalendar size={24} className="text-accent" />
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboardPage;