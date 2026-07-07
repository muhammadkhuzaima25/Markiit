import { useState } from 'react';
import { reviewsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';

const ReviewForm = ({ targetType, targetId, targetUserId, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to leave a review'); return; }
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setLoading(true);
    try {
      const payload = {
        targetUser: targetUserId,
        rating,
        comment,
      };
      if (targetType === 'product') payload.product = targetId;
      if (targetType === 'service') payload.service = targetId;

      await reviewsAPI.create(payload);
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="font-semibold text-charcoal mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Rating</label>
          <StarRating rating={rating} onChange={setRating} size={24} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
            placeholder="Share your experience..."
          />
        </div>
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="flex items-center gap-2 bg-accent text-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 border-none cursor-pointer transition-colors"
        >
          <FiSend size={14} />
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
