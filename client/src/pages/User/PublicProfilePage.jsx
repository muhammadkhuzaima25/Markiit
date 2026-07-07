import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI, reviewsAPI } from '../../services/api';
import StarRating from '../../components/common/StarRating';
import ReviewCard from '../../components/common/ReviewCard';
import ProductCard from '../../components/common/ProductCard';
import ServiceCard from '../../components/common/ServiceCard';
import Loader from '../../components/common/Loader';
import { FiMapPin, FiPackage, FiTool, FiUser } from 'react-icons/fi';

const PublicProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await usersAPI.getPublicProfile(id);
        setProfile(data.user || data.data);
        setProducts(data.products || []);
        setServices(data.services || []);
        const reviewRes = await reviewsAPI.getUserReviews(id);
        const reviewData = reviewRes.data;
        setReviews(Array.isArray(reviewData) ? reviewData : (reviewData.reviews || reviewData.data || []));
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader text="Loading profile..." />;
  if (!profile) return <div className="text-center py-16 text-charcoal-light">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-border p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-neutral flex items-center justify-center text-charcoal-light"><FiUser size={40} /></div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-charcoal mb-1">{profile.name}</h1>
            {profile.locationName && <p className="text-sm text-charcoal-light flex items-center gap-1 justify-center md:justify-start mb-2"><FiMapPin size={14} /> {profile.locationName}</p>}
            {profile.bio && <p className="text-sm text-charcoal-light mb-3">{profile.bio}</p>}
            {profile.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                {profile.skills.map((skill) => <span key={skill} className="text-xs bg-neutral text-charcoal px-3 py-1 rounded-full">{skill}</span>)}
              </div>
            )}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-1"><StarRating rating={profile.ratings || 0} readonly size={16} /><span className="text-sm text-charcoal-light">({profile.numReviews || 0})</span></div>
              <span className="text-sm text-charcoal-light">{products.length + services.length} listings</span>
            </div>
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2"><FiPackage size={20} /> Products ({products.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {services.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2"><FiTool size={20} /> Services ({services.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-charcoal mb-4">Reviews ({reviews.length})</h2>
        {reviews.length > 0 ? (
          <div className="space-y-3">{reviews.map((r) => <ReviewCard key={r._id} review={r} />)}</div>
        ) : <p className="text-sm text-charcoal-light">No reviews yet.</p>}
      </div>
    </div>
  );
};

export default PublicProfilePage;
