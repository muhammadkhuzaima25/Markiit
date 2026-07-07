import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating = 0, onChange, size = 20, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`bg-transparent border-none cursor-${readonly ? 'default' : 'pointer'} p-0 transition-colors ${
            readonly ? 'cursor-default' : ''
          }`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <FiStar
            size={size}
            className={`transition-colors ${
              star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
