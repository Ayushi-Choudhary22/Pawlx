import { useEffect, useState } from 'react';
import { FiUserCheck } from 'react-icons/fi';
import { vetService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import ProfessionalCard from '@/components/booking/ProfessionalCard';
import VetBookingModal from '@/components/booking/VetBookingModal';
import SearchBar from '@/components/common/SearchBar';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonLoader';

const VetsPage = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [selectedVet, setSelectedVet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVets = async () => {
      setLoading(true);
      try {
        const res = await vetService.list({ city: city || undefined });
        setVets(res.data);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchVets, 300);
    return () => clearTimeout(debounce);
  }, [city]);

  const handleBookClick = (vet) => {
    if (!isAuthenticated) {
      showToast('Please log in to book an appointment', 'info');
      navigate('/login');
      return;
    }
    setSelectedVet(vet);
  };

  const handleBookingSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await vetService.bookAppointment(payload);
      showToast('Appointment requested! You can track it from your dashboard.', 'success');
      setSelectedVet(null);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to book appointment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-1">Book a Veterinarian</h1>
      <p className="text-sm text-ink-muted mb-6">Trusted vets, ready to help your pet feel their best.</p>

      <SearchBar value={city} onChange={setCity} placeholder="Search by city..." className="max-w-sm mb-6" />

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : vets.length === 0 ? (
        <EmptyState icon={<FiUserCheck size={32} />} title="No veterinarians found" description="Try a different city." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {vets.map((vet) => (
            <ProfessionalCard key={vet._id} professional={vet} onBook={handleBookClick} ctaLabel="Book Visit" />
          ))}
        </div>
      )}

      <VetBookingModal
        isOpen={!!selectedVet}
        onClose={() => setSelectedVet(null)}
        onSubmit={handleBookingSubmit}
        isSubmitting={isSubmitting}
        vet={selectedVet}
      />
    </div>
  );
};

export default VetsPage;
