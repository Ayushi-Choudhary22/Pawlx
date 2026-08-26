import { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { petSitterService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ProfessionalCard from '@/components/booking/ProfessionalCard';
import SitterBookingModal from '@/components/booking/SitterBookingModal';
import SearchBar from '@/components/common/SearchBar';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonLoader';

const PetSittersPage = () => {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [selectedSitter, setSelectedSitter] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSitters = async () => {
      setLoading(true);
      try {
        const res = await petSitterService.list({ city: city || undefined });
        setSitters(res.data);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchSitters, 300);
    return () => clearTimeout(debounce);
  }, [city]);

  const handleBookClick = (sitter) => {
    if (!isAuthenticated) {
      showToast('Please log in to book a pet sitter', 'info');
      navigate('/login');
      return;
    }
    setSelectedSitter(sitter);
  };

  const handleBookingSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await petSitterService.createBooking(payload);
      showToast('Sitter booking requested successfully!', 'success');
      setSelectedSitter(null);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to book sitter', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-1">Find a Pet Sitter</h1>
      <p className="text-sm text-ink-muted mb-6">Caring, vetted sitters for when you're away.</p>

      <SearchBar value={city} onChange={setCity} placeholder="Search by city..." className="max-w-sm mb-6" />

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : sitters.length === 0 ? (
        <EmptyState icon={<FiUsers size={32} />} title="No pet sitters found" description="Try a different city." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sitters.map((sitter) => (
            <ProfessionalCard key={sitter._id} professional={sitter} onBook={handleBookClick} ctaLabel="Book Sitter" />
          ))}
        </div>
      )}

      <SitterBookingModal
        isOpen={!!selectedSitter}
        onClose={() => setSelectedSitter(null)}
        onSubmit={handleBookingSubmit}
        isSubmitting={isSubmitting}
        sitter={selectedSitter}
      />
    </div>
  );
};

export default PetSittersPage;
