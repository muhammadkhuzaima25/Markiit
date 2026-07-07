import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, servicesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { FiPackage, FiEdit, FiTrash2, FiPlus, FiEye, FiMapPin } from 'react-icons/fi';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  sold: 'bg-blue-100 text-blue-700',
  removed: 'bg-red-100 text-red-700',
  paused: 'bg-gray-100 text-gray-700',
};

const MyListingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, type: null });

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const [prodRes, servRes] = await Promise.all([productsAPI.getMy(), servicesAPI.getMy()]);
      const prodData = prodRes.data;
      const servData = servRes.data;
      setProducts(Array.isArray(prodData) ? prodData : (prodData.products || prodData.data || []));
      setServices(Array.isArray(servData) ? servData : (servData.services || servData.data || []));
    } catch {} finally { setLoading(false); }
  };

  const handleDeleteProduct = async (id) => {
    try { await productsAPI.delete(id); toast.success('Deleted'); fetchListings(); } catch { toast.error('Delete failed'); }
  };

  const handleDeleteService = async (id) => {
    try { await servicesAPI.delete(id); toast.success('Deleted'); fetchListings(); } catch { toast.error('Delete failed'); }
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'product') handleDeleteProduct(deleteModal.id);
    else handleDeleteService(deleteModal.id);
    setDeleteModal({ open: false, id: null, type: null });
  };

  const currentListings = activeTab === 'products' ? products : services;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-charcoal">My Listings</h1>
        <div className="flex gap-2">
          <Link to="/products/create" className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark no-underline flex items-center gap-1">
            <FiPlus size={16} /> Product
          </Link>
          <Link to="/services/create" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-light no-underline flex items-center gap-1">
            <FiPlus size={16} /> Service
          </Link>
        </div>
      </div>

      <div className="flex gap-1 bg-neutral rounded-xl p-1 mb-6">
        <button onClick={() => setActiveTab('products')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer ${activeTab === 'products' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-charcoal-light'}`}>
          Products ({products.length})
        </button>
        <button onClick={() => setActiveTab('services')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer ${activeTab === 'services' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-charcoal-light'}`}>
          Services ({services.length})
        </button>
      </div>

      {loading ? <Loader /> : currentListings.length === 0 ? (
        <EmptyState title={`No ${activeTab} yet`} message="Create your first listing to get started." action={() => window.location.href = activeTab === 'products' ? '/products/create' : '/services/create'} actionText={`Create ${activeTab === 'products' ? 'Product' : 'Service'}`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentListings.map((item) => {
            const img = item.images?.[0] || item.portfolioImages?.[0];
            return (
              <div key={item._id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <Link to={`/${activeTab}/${item._id}`} className="no-underline block">
                  <div className="aspect-[4/3] bg-neutral overflow-hidden relative">
                    {img ? (
                      <img src={img} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-gray-300">
                        <FiPackage size={40} />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-3 flex flex-col flex-1">
                  <Link to={`/${activeTab}/${item._id}`} className="no-underline">
                    <h3 className="font-semibold text-sm text-charcoal leading-snug line-clamp-2 hover:text-primary transition-colors">{item.title}</h3>
                  </Link>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-accent font-bold text-base">${item.price}</span>
                    <span className="text-[11px] text-gray-400 truncate">{item.category}</span>
                  </div>
                  {item.locationName && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                      <FiMapPin size={11} /> {item.locationName}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                    <Link to={`/${activeTab}/${item._id}`} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 py-2 rounded-lg no-underline transition-colors"><FiEye size={14} /> View</Link>
                    <Link to={`/${activeTab}/${item._id}/edit`} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-charcoal bg-neutral hover:bg-gray-200 py-2 rounded-lg no-underline transition-colors"><FiEdit size={14} /> Edit</Link>
                    <button onClick={() => setDeleteModal({ open: true, id: item._id, type: activeTab === 'products' ? 'product' : 'service' })} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg border-none cursor-pointer transition-colors"><FiTrash2 size={14} /> Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null, type: null })} title="Delete Listing" size="sm">
        <p className="text-sm text-charcoal-light mb-6">Are you sure you want to delete this {deleteModal.type}? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteModal({ open: false, id: null, type: null })} className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-charcoal hover:bg-neutral bg-white cursor-pointer transition-colors">Cancel</button>
          <button onClick={confirmDelete} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 border-none cursor-pointer transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default MyListingsPage;
