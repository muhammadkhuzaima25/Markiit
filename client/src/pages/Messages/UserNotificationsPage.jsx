import { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api';
import { FiBell, FiCalendar, FiMessageCircle, FiStar, FiInfo, FiCheck, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import UserLayout from '../../components/layout/UserLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const formatTime = (date) => {
  const msgDate = new Date(date);
  const today = new Date();
  const diff = today - msgDate;
  if (diff < 86400000 && today.getDate() === msgDate.getDate()) {
    return msgDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (diff < 172800000 && today.getDate() - msgDate.getDate() === 1) return 'Yesterday';
  return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'booking': return FiCalendar;
    case 'message': return FiMessageCircle;
    case 'review': return FiStar;
    case 'system': return FiInfo;
    default: return FiBell;
  }
};

const UserNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationsAPI.getAll();
      const notifs = data.notifications || data.data || data;
      setNotifications(Array.isArray(notifs) ? notifs : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) return <UserLayout><Loader text="Loading notifications..." /></UserLayout>;

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-charcoal-light mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:text-accent-dark bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors border-none cursor-pointer disabled:opacity-50"
            >
              <FiCheckCircle size={16} />
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={FiBell}
            title="No notifications yet"
            message="When you receive notifications, they will appear here."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const Icon = getTypeIcon(notif.type);
              return (
                <button
                  key={notif._id}
                  onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-colors text-left cursor-pointer ${
                    notif.read
                      ? 'bg-white border-border'
                      : 'bg-accent/5 border-accent/20'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.read ? 'bg-neutral' : 'bg-accent/10'
                  }`}>
                    <Icon size={18} className={notif.read ? 'text-charcoal-light' : 'text-accent'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm ${notif.read ? 'font-medium text-charcoal' : 'font-semibold text-charcoal'}`}>
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-charcoal-light">{formatTime(notif.createdAt)}</span>
                        {!notif.read && (
                          <FiCheck size={14} className="text-accent cursor-pointer flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {notif.message && (
                      <p className={`text-sm mt-1 ${notif.read ? 'text-charcoal-light' : 'text-charcoal'}`}>
                        {notif.message}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserNotificationsPage;
