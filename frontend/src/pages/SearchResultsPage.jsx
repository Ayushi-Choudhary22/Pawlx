import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiHeart, FiUserCheck } from 'react-icons/fi';
import { searchService } from '@/services/searchService';
import Rating from '@/components/common/Rating';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';

const ROLE_PATH = { veterinarian: '/vets', pet_sitter: '/pet-sitters', groomer: '/grooming' };

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults({ products: [], adoptions: [], professionals: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    searchService
      .search(query)
      .then((res) => setResults(res.data))
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <Loader fullScreen />;

  const total = (results?.products.length || 0) + (results?.adoptions.length || 0) + (results?.professionals.length || 0);

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-1">
        Search results for &ldquo;{query}&rdquo;
      </h1>
      <p className="text-sm text-ink-muted mb-8">{total} result{total !== 1 ? 's' : ''} found</p>

      {total === 0 ? (
        <EmptyState
          icon={<FiSearch size={32} />}
          title="No results found"
          description="Try a different search term or browse our categories directly."
        />
      ) : (
        <div className="space-y-10">
          {results.products.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                <FiPackage size={18} className="text-primary" /> Products
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.products.map((p) => (
                  <Link key={p._id} to={`/marketplace/${p.slug}`} className="card p-3.5 flex gap-3 items-center">
                    <img
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=200&q=80'}
                      alt={p.name}
                      className="h-14 w-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                      <Rating value={p.rating} size={11} />
                      <p className="text-sm font-semibold text-ink mt-0.5">₹{p.discountPrice || p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.adoptions.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                <FiHeart size={18} className="text-secondary" /> Adoptable Pets
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.adoptions.map((a) => (
                  <Link key={a._id} to={`/adoption/${a._id}`} className="card p-3.5 flex gap-3 items-center">
                    <div className="h-14 w-14 rounded-lg bg-secondary-light flex items-center justify-center text-xl shrink-0 overflow-hidden">
                      {a.photos?.[0]?.url ? (
                        <img src={a.photos[0].url} alt={a.name} className="h-full w-full object-cover" />
                      ) : '🐾'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{a.name}</p>
                      <p className="text-xs text-ink-muted capitalize">{a.breed || a.species}</p>
                      {a.location?.city && <p className="text-xs text-ink-muted">{a.location.city}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.professionals.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                <FiUserCheck size={18} className="text-accent" /> Professionals
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.professionals.map((pro) => (
                  <Link key={pro._id} to={ROLE_PATH[pro.role] || '/vets'} className="card p-3.5 flex gap-3 items-center">
                    {pro.avatar?.url ? (
                      <img src={pro.avatar.url} alt={pro.name} className="h-14 w-14 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold shrink-0">
                        {pro.name?.[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{pro.name}</p>
                      <p className="text-xs text-ink-muted capitalize">{pro.role.replace('_', ' ')}</p>
                      {pro.professionalProfile?.city && (
                        <p className="text-xs text-ink-muted">{pro.professionalProfile.city}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
