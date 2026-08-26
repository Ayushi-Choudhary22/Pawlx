import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiBriefcase, FiPhone, FiVideo, FiHome } from 'react-icons/fi';
import { professionalService, vetService, petSitterService, groomingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ROLES } from '@/constants';
import Rating from '@/components/common/Rating';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import ReviewsSection from '@/components/common/ReviewsSection';
import VetBookingModal from '@/components/booking/VetBookingModal';
import SitterBookingModal from '@/components/booking/SitterBookingModal';
import GroomingBookingModal from '@/components/booking/GroomingBookingModal';

const ROLE_CONFIG = {
  [ROLES.VETERINARIAN]: { modal: VetBookingModal, service: vetService, book: (svc, payload) => svc.bookAppointment(payload), targetType: 'veterinarian' },
  [ROLES.PET_SITTER]: { modal: SitterBookingModal, service: petSitterService, book: (svc, payload) => svc.createBooking(payload), targetType: 'pet_sitter' },
  [ROLES.GROOMER]: { modal: GroomingBookingModal, service: groomingService, book: (svc, payload) => svc.createBooking(payload), targetType: 'groomer' },
};

const ProfessionalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    professionalService
      .getById(id)
      .then((res) => setProfessional(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Loader fullScreen />;
  if (!professional) return null;

  const config = ROLE_CONFIG[professional.role];
  const profile = professional.professionalProfile || {};
  const BookingModal = config?.modal;

  const handleBookClick = () => {
    if (!isAuthenticated) {
      showToast('Please log in to book', 'info');
      navigate('/login');
      return;
    }
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await config.book(config.service, payload);
      showToast('Booking requested successfully!', 'success');
      setIsBookingOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6"
      >
        <FiArrowLeft size={14} /> Back
      </button>

      <div className="card p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
        <div className="flex items-center gap-4">
          {professional.avatar?.url ? (
            <img src={professional.avatar.url} alt={professional.name} className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-primary-light text-primary flex items-center justify-center text-2xl font-semibold">
              {professional.name?.[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-ink">{professional.name}</h1>
              {profile.offersVideoConsultation && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary">
                  <FiVideo size={11} /> Video Consults Available
                </span>
              )}
            </div>
            <p className="text-xs text-ink-muted capitalize mb-1">{professional.role.replace('_', ' ')}</p>
            <Rating value={profile.rating} count={profile.totalReviews} />
          </div>
        </div>
        {config && (
          <Button onClick={handleBookClick} className="shrink-0">Book Now</Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {profile.city && (
          <div className="card p-4 flex items-center gap-3">
            <FiMapPin className="text-primary" size={18} />
            <div>
              <p className="text-xs text-ink-muted">Location</p>
              <p className="text-sm font-medium text-ink">{profile.city}</p>
            </div>
          </div>
        )}
        {profile.experienceYears !== undefined && (
          <div className="card p-4 flex items-center gap-3">
            <FiBriefcase className="text-primary" size={18} />
            <div>
              <p className="text-xs text-ink-muted">Experience</p>
              <p className="text-sm font-medium text-ink">{profile.experienceYears} years</p>
            </div>
          </div>
        )}
        {professional.phone && (
          <div className="card p-4 flex items-center gap-3">
            <FiPhone className="text-primary" size={18} />
            <div>
              <p className="text-xs text-ink-muted">Contact Number</p>
              <p className="text-sm font-medium text-ink">{professional.phone}</p>
            </div>
          </div>
        )}
        {profile.clinicAddress && (
          <div className="card p-4 flex items-center gap-3 sm:col-span-2">
            <FiHome className="text-primary shrink-0" size={18} />
            <div>
              <p className="text-xs text-ink-muted">Visit In Person At</p>
              <p className="text-sm font-medium text-ink">{profile.clinicAddress}</p>
            </div>
          </div>
        )}
      </div>

      {profile.bio && (
        <div className="card p-5 mb-8">
          <h3 className="font-semibold text-ink mb-2">About</h3>
          <p className="text-sm text-ink-muted leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {config && <ReviewsSection targetType={config.targetType} targetId={professional._id} />}

      {config && BookingModal && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onSubmit={handleBookingSubmit}
          isSubmitting={isSubmitting}
          {...(professional.role === ROLES.VETERINARIAN ? { vet: professional } : {})}
          {...(professional.role === ROLES.PET_SITTER ? { sitter: professional } : {})}
          {...(professional.role === ROLES.GROOMER ? { groomer: professional } : {})}
        />
      )}
    </div>
  );
};

export default ProfessionalDetailPage;
