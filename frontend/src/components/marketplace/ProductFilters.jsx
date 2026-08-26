import { useEffect, useState } from 'react';
import { categoryService } from '@/services/adminService';

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];

const ProductFilters = ({ filters, onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.list().then((res) => setCategories(res.data));
  }, []);

  return (
    <div className="card p-4 space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-ink mb-2.5">Sort by</h4>
        <select
          className="input text-sm"
          value={filters.sort || ''}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink mb-2.5">Category</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input
              type="radio"
              checked={!filters.category}
              onChange={() => onChange({ ...filters, category: '' })}
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
              <input
                type="radio"
                checked={filters.category === cat._id}
                onChange={() => onChange({ ...filters, category: cat._id })}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink mb-2.5">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="input text-sm"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
          />
          <span className="text-ink-muted">–</span>
          <input
            type="number"
            placeholder="Max"
            className="input text-sm"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
