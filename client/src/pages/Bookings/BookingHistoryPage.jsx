import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import BookingCard from '../../components/common/BookingCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiCalendar } from 'react-icons/fi';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sent');
  const [sentBookings, setSentBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [sentRes, receivedRes] = await Promise.all([
        bookingsAPI.getMy(),
        bookingsAPI.getReceived(),
      ]);
      const sentData = sentRes.data;
      const receivedData = receivedRes.data;
      setSentBookings(Array.isArray(sentData) ? sentData : (sentData.bookings || sentData.data || []));
      setReceivedBookings(Array.isArray(receivedData) ? receivedData : (receivedData.bookings || receivedData.data || []));
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status);
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const currentBookings = activeTab === 'sent' ? sentBookings : receivedBookings;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-charcoal mb-8">My Bookings</h1>

      <div className="flex gap-1 bg-neutral rounded-xl p-1 mb-8">
        <button onClick={() => setActiveTab('sent')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer ${activeTab === 'sent' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-charcoal-light hover:text-charcoal'}`}>
          My Requests ({sentBookings.length})
        </button>
        <button onClick={() => setActiveTab('received')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer ${activeTab === 'received' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-charcoal-light hover:text-charcoal'}`}>
          Requests Received ({receivedBookings.length})
        </button>
      </div>

      {loading ? (
        <Loader text="Loading bookings..." />
      ) : currentBookings.length === 0 ? (
        <EmptyState icon={FiCalendar} title="No bookings" message={activeTab === 'sent' ? "You haven't made any booking requests yet." : "No booking requests received yet."} />
      ) : (
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} type={activeTab === 'sent' ? 'buyer' : 'provider'} onAction={handleStatusUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
