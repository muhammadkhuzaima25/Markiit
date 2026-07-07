import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/common/StarRating';
import ReviewCard from '../../components/common/ReviewCard';
import ReviewForm from '../../components/common/ReviewForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FiHeart, FiMessageSquare, FiMapPin, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await productsAPI.getOne(id);
        setProduct(data.product || data.data || data);
        const prodData = data.product || data.data || data;
        if (prodData.favorites?.includes(user?._id)) {
          setIsFavorite(true);
        }
        const reviewRes = await reviewsAPI.getProductReviews(id);
        const reviewData = reviewRes.data;
        setReviews(Array.isArray(reviewData) ? reviewData : (reviewData.reviews || reviewData.data || []));
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFavorite = async () => {
    if (!user) { toast.error('Please login to favorite'); return; }
    try {
      const { data } = await productsAPI.toggleFavorite(id);
      setIsFavorite(data.favorited);
      toast.success(data.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  const handleMessage = () => {
    if (!user) { toast.error('Please login to message'); return; }
    if (user._id === product.user._id) { toast.error('You cannot message yourself'); return; }
    navigate(`/chat?user=${product.user._id}`);
  };

  if (loading) return <Loader text="Loading product..." />;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-neutral rounded-xl overflow-hidden mb-4 relative">
            {product.images?.length > 0 ? (
              <img src={product.images[currentImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-charcoal-light">No Image</div>
            )}
            {product.images?.length > 1 && (
              <>
                <button onClick={() => setCurrentImage((prev) => prev === 0 ? product.images.length - 1 : prev - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md border-none cursor-pointer">
                  <FiChevronLeft size={20} />
                </button>
                <button onClick={() => setCurrentImage((prev) => prev === product.images.length - 1 ? 0 : prev + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md border-none cursor-pointer">
                  <FiChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer bg-white ${i === currentImage ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-charcoal-light bg-neutral px-3 py-1 rounded-full">{product.category}</span>
            {product.condition && <span className="text-sm text-charcoal-light bg-neutral px-3 py-1 rounded-full">{product.condition}</span>}
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-4">{product.title}</h1>
          <div className="text-4xl font-bold text-accent mb-6">${product.price}</div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <StarRating rating={product.ratings || 0} readonly size={16} />
              <span className="text-sm text-charcoal-light">({product.numReviews || 0} reviews)</span>
            </div>
            {product.locationName && (
              <span className="text-sm text-charcoal-light flex items-center gap-1">
                <FiMapPin size={14} /> {product.locationName}
              </span>
            )}
          </div>

          <p className="text-charcoal-light mb-8 leading-relaxed">{product.description}</p>

          <div className="flex gap-3 mb-8">
            <button onClick={handleMessage} className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-xl font-semibold text-sm hover:bg-accent-dark border-none cursor-pointer transition-colors">
              <FiMessageSquare size={18} /> Message Seller
            </button>
            <button onClick={handleFavorite} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-colors cursor-pointer ${isFavorite ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-border text-charcoal hover:bg-neutral'}`}>
              <FiHeart size={18} className={isFavorite ? 'fill-red-500' : ''} /> {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Seller Card */}
          {product.user && (
            <Link to={`/profile/${product.user._id}`} className="block bg-neutral rounded-xl p-4 hover:shadow-md transition-shadow no-underline">
              <div className="flex items-center gap-3">
                {product.user.avatar ? (
                  <img src={product.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-charcoal-light">
                    <FiUser size={20} />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-charcoal">{product.user.name}</h4>
                  {product.user.locationName && <p className="text-xs text-charcoal-light">{product.user.locationName}</p>}
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
          <div className="space-y-4">
            {reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
          </div>
        ) : (
          <p className="text-charcoal-light text-sm mb-6">No reviews yet for this product.</p>
        )}
        {user && product.user?._id !== user._id && (
          <div className="mt-6">
            <ReviewForm
              targetType="product"
              targetId={product._id}
              targetUserId={product.user?._id}
              onReviewAdded={async () => {
                const reviewRes = await reviewsAPI.getProductReviews(id);
                const reviewData = reviewRes.data;
                setReviews(Array.isArray(reviewData) ? reviewData : (reviewData.reviews || reviewData.data || []));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
