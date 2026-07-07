import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { servicesAPI, bookingsAPI, reviewsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/common/StarRating';
import ReviewCard from '../../components/common/ReviewCard';
import ReviewForm from '../../components/common/ReviewForm';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiMessageSquare, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await servicesAPI.getOne(id);
        setService(data.service || data.data || data);
        const reviewRes = await reviewsAPI.getServiceReviews(id);
        const reviewData = reviewRes.data;
        setReviews(Array.isArray(reviewData) ? reviewData : (reviewData.reviews || reviewData.data || []));
      } catch (err) {
        toast.error('Service not found');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); return; }
    setBookingLoading(true);
    try {
      await bookingsAPI.create({ serviceId: id, date: bookingForm.date, time: bookingForm.time, notes: bookingForm.notes });
      toast.success('Booking request sent!');
      setShowBookingModal(false);
      setBookingForm({ date: '', time: '', notes: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleMessage = () => {
    if (!user) { toast.error('Please login to message'); return; }
    if (user._id === service.user._id) { toast.error('You cannot message yourself'); return; }
    navigate(`/chat?user=${service.user._id}`);
  };

  const allImages = [...(service?.images || []), ...(service?.portfolioImages || [])].filter(Boolean);

  if (loading) return <Loader text="Loading service..." />;
  if (!service) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-neutral rounded-xl overflow-hidden mb-4 relative">
            {allImages.length > 0 ? (
              <img src={allImages[currentImage]} alt={service.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-charcoal-light">No Image</div>
            )}
            {allImages.length > 1 && (
              <>
                <button onClick={() => setCurrentImage((prev) => prev === 0 ? allImages.length - 1 : prev - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md border-none cursor-pointer">
                  <FiChevronLeft size={20} />
                </button>
                <button onClick={() => setCurrentImage((prev) => prev === allImages.length - 1 ? 0 : prev + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md border-none cursor-pointer">
                  <FiChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer bg-white ${i === currentImage ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-charcoal-light bg-neutral px-3 py-1 rounded-full">{service.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-4">{service.title}</h1>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-accent">${service.price}</span>
            {service.priceType === 'hourly' && <span className="text-charcoal-light">/hour</span>}
            {service.priceType === 'starting_at' && <span className="text-charcoal-light">starting at</span>}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-charcoal-light">
            <div className="flex items-center gap-1">
              <StarRating rating={service.ratings || 0} readonly size={16} />
              <span>({service.numReviews || 0} reviews)</span>
            </div>
            {service.serviceType === 'online' && <span className="flex items-center gap-1 text-accent font-medium">Online / Digital</span>}
            {service.deliveryTime && <span className="flex items-center gap-1"><FiClock size={14} /> {service.deliveryTime}</span>}
            {service.locationName && <span className="flex items-center gap-1"><FiMapPin size={14} /> {service.locationName}</span>}
          </div>

          <p className="text-charcoal-light mb-8 leading-relaxed">{service.description}</p>

          <div className="flex gap-3 mb-8">
            <button onClick={() => {
              if (!user) { toast.error('Please login to book'); return; }
              if (user._id === service.user._id) { toast.error('You cannot book your own service'); return; }
              setShowBookingModal(true);
            }} className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-xl font-semibold text-sm hover:bg-accent-dark border-none cursor-pointer transition-colors">
              <FiCalendar size={18} /> Book This Service
            </button>
            <button onClick={handleMessage} className="flex items-center gap-2 bg-white border border-border px-6 py-3 rounded-xl font-semibold text-sm hover:bg-neutral text-charcoal transition-colors cursor-pointer">
              <FiMessageSquare size={18} /> Message
            </button>
          </div>

          {/* Provider Card */}
          {service.user && (
            <Link to={`/profile/${service.user._id}`} className="block bg-neutral rounded-xl p-4 hover:shadow-md transition-shadow no-underline">
              <div className="flex items-center gap-3">
                {service.user.avatar ? (
                  <img src={service.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-charcoal-light">
                    <FiUser size={20} />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-charcoal">{service.user.name}</h4>
                  <p className="text-xs text-charcoal-light">Service Provider</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-charcoal mb-6">Reviews ({reviews.length})</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">{reviews.map((review) => <ReviewCard key={review._id} review={review} />)}</div>
        ) : (
          <p className="text-charcoal-light text-sm mb-6">No reviews yet for this service.</p>
        )}
        {user && service.user?._id !== user._id && (
          <div className="mt-6">
            <ReviewForm
              targetType="service"
              targetId={service._id}
              targetUserId={service.user?._id}
              onReviewAdded={async () => {
                const reviewRes = await reviewsAPI.getServiceReviews(id);
                const reviewData = reviewRes.data;
                setReviews(Array.isArray(reviewData) ? reviewData : (reviewData.reviews || reviewData.data || []));
              }}
            />
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Book This Service">
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Date</label>
            <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} required min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Preferred Time</label>
            <input type="time" value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Notes</label>
            <textarea value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none" placeholder="Any special requirements or details..." />
          </div>
          <button type="submit" disabled={bookingLoading} className="w-full bg-accent text-primary py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-dark disabled:opacity-50 border-none cursor-pointer transition-colors">
            {bookingLoading ? 'Sending...' : 'Send Booking Request'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceDetailPage;
