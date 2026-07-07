import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  FiUsers,
  FiPackage,
  FiCalendar,
  FiAlertTriangle,
  FiTrendingUp,
  FiArrowRight,
  FiUserPlus,
  FiTag,
  FiClock,
} from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, trend, trendLabel }) => (
  <div className="bg-white rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-2xl font-bold text-charcoal">{value}</p>
        <p className="text-sm text-charcoal-light mt-1">{label}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-accent" />
      </div>
    </div>
    {trend !== undefined && (
      <div className="mt-3 pt-3 border-t border-border/50">
        <span
          className={`text-xs font-medium ${
            trend >= 0 ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {trend >= 0 ? '+' : ''}
          {trend}%
        </span>
        <span className="text-xs text-charcoal-light ml-1">{trendLabel || 'this month'}</span>
      </div>
    )}
  </div>
);

const ActivityIcon = ({ type }) => {
  const cls = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0';
  switch (type) {
    case 'user':
      return (
        <div className={`${cls} bg-blue-50`}>
          <FiUserPlus size={14} className="text-blue-500" />
        </div>
      );
    case 'product':
      return (
        <div className={`${cls} bg-emerald-50`}>
          <FiPackage size={14} className="text-emerald-500" />
        </div>
      );
    case 'service':
      return (
        <div className={`${cls} bg-violet-50`}>
          <FiTag size={14} className="text-violet-500" />
        </div>
      );
    case 'booking':
      return (
        <div className={`${cls} bg-amber-50`}>
          <FiCalendar size={14} className="text-amber-500" />
        </div>
      );
    default:
      return (
        <div className={`${cls} bg-gray-50`}>
          <FiClock size={14} className="text-gray-400" />
        </div>
      );
  }
};

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getRecentActivity(),
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data.activity || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader text="Loading dashboard..." />
      </div>
    );
  }

  const totalListings = (stats?.totalProducts || 0) + (stats?.totalServices || 0);
  const listingsTrend =
    stats?.totalListingsLastMonth > 0
      ? Math.round(
          ((totalListings - (stats.totalListingsLastMonth || totalListings)) /
            (stats.totalListingsLastMonth || 1)) *
            100
        )
      : 0;

  const statCards = [
    {
      icon: FiUsers,
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      trend: stats?.newUsersThisMonth,
      trendLabel: 'new this month',
    },
    {
      icon: FiPackage,
      label: 'Total Listings',
      value: totalListings,
      trend: stats?.newListingsThisMonth,
      trendLabel: 'new this month',
    },
    {
      icon: FiCalendar,
      label: 'Total Bookings',
      value: stats?.totalBookings || 0,
    },
    {
      icon: FiTrendingUp,
      label: 'Active Listings',
      value: stats?.totalActiveListings || 0,
    },
  ];

  const chartData = [
    { name: 'Mon', users: 12, bookings: 5 },
    { name: 'Tue', users: 19, bookings: 8 },
    { name: 'Wed', users: 15, bookings: 12 },
    { name: 'Thu', users: 22, bookings: 9 },
    { name: 'Fri', users: 30, bookings: 15 },
    { name: 'Sat', users: 25, bookings: 18 },
    { name: 'Sun', users: 18, bookings: 10 },
  ];

  const quickLinks = [
    {
      to: '/admin/users',
      icon: FiUsers,
      title: 'Manage Users',
      desc: 'View, suspend, or reactivate user accounts',
      color: 'text-blue-500 bg-blue-50',
    },
    {
      to: '/admin/listings',
      icon: FiPackage,
      title: 'Manage Listings',
      desc: 'Approve, reject, or remove products & services',
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      to: '/admin/reports',
      icon: FiAlertTriangle,
      title: 'Reported Content',
      desc: 'Review and resolve user-submitted reports',
      color: 'text-red-500 bg-red-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 overflow-hidden">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-border p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-charcoal">Platform Growth</h3>
            <span className="text-xs text-charcoal-light bg-neutral px-2.5 py-1 rounded-full">
              Last 7 days
            </span>
          </div>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#5A5A5A', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#5A5A5A', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="users" fill="#1B4A54" radius={[4, 4, 0, 0]} name="Users" />
                <Bar dataKey="bookings" fill="#8CD211" radius={[4, 4, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border p-6 flex flex-col">
          <h3 className="text-base font-semibold text-charcoal mb-4">Recent Activity</h3>
          {activity.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 rounded-full bg-neutral flex items-center justify-center mb-3">
                <FiClock size={20} className="text-charcoal-light" />
              </div>
              <p className="text-sm font-medium text-charcoal">No recent activity yet</p>
              <p className="text-xs text-charcoal-light mt-1">Events will appear here as they happen</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-1 -mx-2 px-2 max-h-[280px]">
              {activity.slice(0, 12).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-neutral/50 transition-colors"
                >
                  <ActivityIcon type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal truncate">
                      {item.data?.name || item.data?.title || item.type === 'booking' ? 'New booking' : 'Activity'}
                    </p>
                    <p className="text-xs text-charcoal-light">{timeAgo(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-charcoal mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group bg-white rounded-xl shadow-sm border border-border p-5 hover:border-accent hover:shadow-md transition-all duration-200 no-underline overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color} flex-shrink-0`}>
                  <link.icon size={20} />
                </div>
                <FiArrowRight
                  size={16}
                  className="text-charcoal-light group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 mt-1 flex-shrink-0"
                />
              </div>
              <h4 className="text-sm font-semibold text-charcoal mt-4 group-hover:text-primary transition-colors">
                {link.title}
              </h4>
              <p className="text-xs text-charcoal-light mt-1 leading-relaxed break-words">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
