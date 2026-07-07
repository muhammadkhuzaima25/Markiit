import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FiHeart, FiTrash2 } from 'react-icons/fi';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await productsAPI.getFavorites();
      const items = Array.isArray(data) ? data : (data.products || data.data || []);
      setFavorites(items);
    } catch {} finally { setLoading(false); }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await productsAPI.toggleFavorite(productId);
      setFavorites((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove from favorites');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-charcoal mb-8">My Favorites</h1>
      {loading ? <Loader text="Loading favorites..." /> : favorites.length === 0 ? (
        <EmptyState icon={FiHeart} title="No favorites yet" message="Save products you love and they'll appear here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((p) => (
            <div key={p._id} className="relative group">
              <ProductCard product={p} />
              <button
                onClick={(e) => { e.preventDefault(); handleRemoveFavorite(p._id); }}
                className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 text-red-500 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all border-none cursor-pointer z-10"
                title="Remove from favorites"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
