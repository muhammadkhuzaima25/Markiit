import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        {review.user?.avatar ? (
          <img src={review.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center text-charcoal-light text-sm font-semibold">
            {review.user?.name?.charAt(0) || '?'}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm text-charcoal">{review.user?.name || 'Anonymous'}</h4>
            <span className="text-xs text-charcoal-light">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <StarRating rating={review.rating} readonly size={14} />
          {review.comment && <p className="text-sm text-charcoal-light mt-2">{review.comment}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
