import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import FilterSidebar from '../../components/common/FilterSidebar';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FiSearch, FiSliders } from 'react-icons/fi';

const ProductListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const location = searchParams.get('location') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: 12 };
        if (searchQuery) params.search = searchQuery;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (location) params.location = location;
        if (sort) params.sort = sort;
        const { data } = await productsAPI.getAll(params);
        setProducts(data.products || data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set('search', searchQuery);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Products</h1>
          <p className="text-charcoal-light mt-1">Browse products from your community</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary w-64"
            />
          </div>
          {(searchQuery || category || minPrice || maxPrice || location || sort !== 'newest') && (
            <button type="button" onClick={() => { setSearchParams({}); setSearchQuery(''); }} className="px-3 py-2.5 text-sm text-primary hover:underline bg-transparent border-none cursor-pointer whitespace-nowrap">View All Products</button>
          )}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden p-2.5 border border-border rounded-lg hover:bg-neutral bg-white cursor-pointer"
          >
            <FiSliders size={18} />
          </button>
        </form>
      </div>

      <div className="flex gap-8">
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <FilterSidebar
            filters={{ category, minPrice, maxPrice, location, sort }}
            onFilterChange={handleFilterChange}
            type="product"
          />
        </div>
        <div className="flex-1">
          {loading ? (
            <Loader text="Loading products..." />
          ) : products.length === 0 ? (
            <EmptyState title="No products found" message="Try adjusting your filters or search query." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingsPage;
