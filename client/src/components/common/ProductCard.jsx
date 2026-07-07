import { Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <Link to={`/products/${product._id}`} className="no-underline block">
        <div className="aspect-[4/3] bg-neutral overflow-hidden relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-gray-300">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-[10px] text-gray-300 font-medium">No Image</span>
            </div>
          )}
          {product.condition && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-charcoal text-[11px] font-medium px-2.5 py-1 rounded-full">
              {product.condition}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link to={`/products/${product._id}`} className="no-underline">
            <h3 className="font-semibold text-[#2E2E2E] text-sm leading-snug line-clamp-2 hover:text-[#1B4A54] transition-colors">
              {product.title}
            </h3>
          </Link>
          <span className="text-[#8CD211] font-bold text-base whitespace-nowrap">${product.price}</span>
        </div>

        {product.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.ratings || 0} readonly size={13} />
          <span className="text-[11px] text-gray-400">({product.numReviews || 0})</span>
        </div>

        {product.locationName && (
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
            <FiMapPin size={11} className="text-[#1B4A54]" />
            <span>{product.locationName}</span>
          </div>
        )}

        <div className="mt-auto pt-2 border-t border-gray-100">
          <Link
            to={`/products/${product._id}`}
            className="block w-full text-center bg-[#8CD211] hover:bg-[#7AB810] text-[#1B4A54] text-xs font-semibold py-2.5 rounded-lg no-underline transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
