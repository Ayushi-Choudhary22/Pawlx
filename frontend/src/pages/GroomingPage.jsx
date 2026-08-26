import { useEffect, useState } from 'react';
import { FiScissors } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { groomingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ProfessionalCard from '@/components/booking/ProfessionalCard';
import GroomingBookingModal from '@/components/booking/GroomingBookingModal';
import SearchBar from '@/components/common/SearchBar';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonLoader';

const GroomingPage = () => {
  const [groomers, setGroomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [selectedGroomer, setSelectedGroomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroomers = async () => {
      setLoading(true);
      try {
        const res = await groomingService.list({ city: city || undefined });
        setGroomers(res.data);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchGroomers, 300);
    return () => clearTimeout(debounce);
  }, [city]);

  const handleBookClick = (groomer) => {
    if (!isAuthenticated) {
      showToast('Please log in to book grooming', 'info');
      navigate('/login');
      return;
    }
    setSelectedGroomer(groomer);
  };

  const handleBookingSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await groomingService.createBooking(payload);
      showToast('Grooming appointment requested!', 'success');
      setSelectedGroomer(null);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to book grooming', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-1">Book Grooming</h1>
      <p className="text-sm text-ink-muted mb-6">Pamper your pet with a trusted local groomer.</p>

      <SearchBar value={city} onChange={setCity} placeholder="Search by city..." className="max-w-sm mb-6" />

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : groomers.length === 0 ? (
        <EmptyState icon={<FiScissors size={32} />} title="No groomers found" description="Try a different city." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {groomers.map((groomer) => (
            <ProfessionalCard key={groomer._id} professional={groomer} onBook={handleBookClick} ctaLabel="Book Grooming" />
          ))}
        </div>
      )}

      <GroomingBookingModal
        isOpen={!!selectedGroomer}
        onClose={() => setSelectedGroomer(null)}
        onSubmit={handleBookingSubmit}
        isSubmitting={isSubmitting}
        groomer={selectedGroomer}
      />
    </div>
  );
};

export default GroomingPage;
