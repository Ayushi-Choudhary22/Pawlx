import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiPackage, FiHeart, FiUserCheck } from 'react-icons/fi';
import { searchService } from '@/services/searchService';

const GlobalSearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    const debounce = setTimeout(async () => {
      try {
        const res = await searchService.search(query);
        setResults(res.data);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose?.();
  };

  const goTo = (path) => {
    navigate(path);
    onClose?.();
  };

  const hasResults =
    results && (results.products.length || results.adoptions.length || results.professionals.length);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-card shadow-cardHover overflow-hidden">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <FiSearch className="text-ink-muted shrink-0" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, adoptable pets, vets, sitters..."
            className="flex-1 outline-none text-sm text-ink placeholder:text-ink-muted"
          />
          <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink">
            <FiX size={18} />
          </button>
        </form>

        <div className="max-h-96 overflow-y-auto">
          {loading && <p className="text-sm text-ink-muted text-center py-6">Searching...</p>}

          {!loading && query.trim().length >= 2 && !hasResults && (
            <p className="text-sm text-ink-muted text-center py-6">No results for &ldquo;{query}&rdquo;</p>
          )}

          {!loading && results?.products?.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-semibold text-ink-muted uppercase px-2 mb-1">Products</p>
              {results.products.map((p) => (
                <button
                  key={p._id}
                  onClick={() => goTo(`/marketplace/${p.slug}`)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface text-left"
                >
                  <FiPackage className="text-primary shrink-0" size={16} />
                  <span className="text-sm text-ink truncate">{p.name}</span>
                  <span className="text-xs text-ink-muted ml-auto shrink-0">₹{p.discountPrice || p.price}</span>
                </button>
              ))}
            </div>
          )}

          {!loading && results?.adoptions?.length > 0 && (
            <div className="p-3 border-t border-border">
              <p className="text-xs font-semibold text-ink-muted uppercase px-2 mb-1">Adoption</p>
              {results.adoptions.map((a) => (
                <button
                  key={a._id}
                  onClick={() => goTo(`/adoption/${a._id}`)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface text-left"
                >
                  <FiHeart className="text-secondary shrink-0" size={16} />
                  <span className="text-sm text-ink truncate">{a.name}</span>
                  <span className="text-xs text-ink-muted ml-auto shrink-0 capitalize">{a.species}</span>
                </button>
              ))}
            </div>
          )}

          {!loading && results?.professionals?.length > 0 && (
            <div className="p-3 border-t border-border">
              <p className="text-xs font-semibold text-ink-muted uppercase px-2 mb-1">Professionals</p>
              {results.professionals.map((pro) => (
                <button
                  key={pro._id}
                  onClick={() => goTo(pro.role === 'veterinarian' ? '/vets' : pro.role === 'pet_sitter' ? '/pet-sitters' : '/grooming')}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface text-left"
                >
                  <FiUserCheck className="text-accent shrink-0" size={16} />
                  <span className="text-sm text-ink truncate">{pro.name}</span>
                  <span className="text-xs text-ink-muted ml-auto shrink-0 capitalize">{pro.role.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchBar;
