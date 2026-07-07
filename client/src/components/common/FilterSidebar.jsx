import { useState } from 'react';
import StarRating from './StarRating';

const locations = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Mardan', 'Swat', 'Gilgit', 'Skardu'];

const FilterSidebar = ({ filters, onFilterChange, type = 'product' }) => {
  const productCategories = ['Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Other'];
  const serviceCategories = ['Graphic Design', 'Web Development', 'Photography', 'Home Services', 'Tutoring', 'Content Writing', 'Digital Marketing', 'Video Editing', 'Other'];
  const categories = type === 'product' ? productCategories : serviceCategories;

  const [localFilters, setLocalFilters] = useState(filters || {});

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-charcoal">Filters</h3>
        <button onClick={clearFilters} className="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer">Clear All</button>
      </div>

      <div>
        <label className="text-sm font-medium text-charcoal block mb-2">Category</label>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-charcoal-light cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={localFilters.category === cat}
                onChange={() => handleChange('category', localFilters.category === cat ? '' : cat)}
                className="accent-primary"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-charcoal block mb-2">Location</label>
        <select
          value={localFilters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-charcoal block mb-2">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-1/2 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-1/2 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-charcoal block mb-2">Minimum Rating</label>
        <StarRating
          rating={localFilters.minRating || 0}
          onChange={(val) => handleChange('minRating', localFilters.minRating === val ? 0 : val)}
          size={18}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-charcoal block mb-2">Sort By</label>
        <select
          value={localFilters.sort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
