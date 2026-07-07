import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsAPI, servicesAPI } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import ServiceCard from '../../components/common/ServiceCard';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FiSearch } from 'react-icons/fi';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) { setLoading(false); return; }
      setLoading(true);
      try {
        const [prodRes, servRes] = await Promise.all([
          productsAPI.getAll({ search: searchQuery, page: currentPage, limit: 12 }),
          servicesAPI.getAll({ search: searchQuery, page: currentPage, limit: 12 }),
        ]);
        setProducts(prodRes.data.products || prodRes.data.data || []);
        setServices(servRes.data.services || servRes.data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchResults();
  }, [searchQuery, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: query, page: '1' });
  };

  const currentResults = activeTab === 'products' ? products : activeTab === 'services' ? services : [...products, ...services];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" size={20} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products and services..." className="w-full pl-12 pr-4 py-3.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary shadow-sm" />
        </div>
      </form>

      {searchQuery && (
        <p className="text-charcoal-light mb-6">Results for "<span className="font-medium text-charcoal">{searchQuery}</span>" ({currentResults.length} found)</p>
      )}

      <div className="flex gap-1 bg-neutral rounded-xl p-1 mb-6 w-fit">
        {['all', 'products', 'services'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer capitalize ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-charcoal-light'}`}>
            {tab} {tab === 'products' ? `(${products.length})` : tab === 'services' ? `(${services.length})` : ''}
          </button>
        ))}
      </div>

      {!searchQuery ? (
        <EmptyState title="Search Markiit" message="Find products and services from your community" />
      ) : loading ? <Loader text="Searching..." /> : currentResults.length === 0 ? (
        <EmptyState title="No results found" message="Try different keywords or broaden your search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentResults.map((item) => item.category && item.deliveryTime !== undefined ? (
            <ServiceCard key={item._id} service={item} />
          ) : (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
