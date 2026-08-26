import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { adoptionService } from '@/services/adoptionService';
import { useAuth } from '@/context/AuthContext';
import AdoptionCard from '@/components/adoption/AdoptionCard';
import AdoptionFilters from '@/components/adoption/AdoptionFilters';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/SkeletonLoader';

const AdoptionPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await adoptionService.list(filters);
        setListings(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1">Adopt a Pet</h1>
          <p className="text-sm text-ink-muted">Give a loving home to a pet waiting for one.</p>
        </div>
        {isAuthenticated && (
          <Link to="/adoption/list-pet">
            <Button variant="outline">List a Pet for Adoption</Button>
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <AdoptionFilters filters={filters} onChange={setFilters} />

        <div>
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              icon={<FiHeart size={32} />}
              title="No pets available right now"
              description="Try adjusting your filters, or check back soon for new listings."
            />
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((pet) => <AdoptionCard key={pet._id} pet={pet} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptionPage;
