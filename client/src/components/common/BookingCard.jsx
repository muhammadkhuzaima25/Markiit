import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const BookingCard = ({ booking, type = 'buyer', onAction }) => {
  const otherParty = type === 'buyer' ? booking.provider : booking.buyer;

  return (
    <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-charcoal text-sm">{booking.service?.title || 'Service'}</h4>
          <p className="text-xs text-charcoal-light flex items-center gap-1 mt-1">
            <FiUser size={12} /> {otherParty?.name || 'Unknown'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || ''}`}>
          {booking.status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-charcoal-light mb-3">
        <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(booking.date).toLocaleDateString()}</span>
        {booking.time && <span className="flex items-center gap-1"><FiClock size={12} /> {booking.time}</span>}
      </div>
      {booking.notes && <p className="text-xs text-charcoal-light bg-neutral rounded-lg p-2 mb-3">{booking.notes}</p>}
      {onAction && booking.status === 'pending' && type === 'provider' && (
        <div className="flex gap-2">
          <button onClick={() => onAction(booking._id, 'accepted')} className="bg-accent text-primary px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-accent-dark border-none cursor-pointer transition-colors">Accept</button>
          <button onClick={() => onAction(booking._id, 'rejected')} className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 border-none cursor-pointer transition-colors">Reject</button>
          <button onClick={() => onAction(booking._id, 'cancelled')} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 border-none cursor-pointer transition-colors">Cancel</button>
        </div>
      )}
      {onAction && booking.status === 'pending' && type === 'buyer' && (
        <div className="flex gap-2">
          <button onClick={() => onAction(booking._id, 'cancelled')} className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 border-none cursor-pointer transition-colors">Cancel</button>
        </div>
      )}
      {onAction && booking.status === 'accepted' && (
        <div className="flex gap-2">
          <button onClick={() => onAction(booking._id, 'completed')} className="bg-green-100 text-green-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-200 border-none cursor-pointer transition-colors">Complete</button>
          <button onClick={() => onAction(booking._id, 'cancelled')} className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 border-none cursor-pointer transition-colors">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
