import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCheckCircle, FiXCircle, FiHeart } from 'react-icons/fi';
import { adoptionService } from '@/services/adoptionService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import AdoptionApplyModal from '@/components/adoption/AdoptionApplyModal';

const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', bird: '🐦', rabbit: '🐰', fish: '🐠', reptile: '🦎', other: '🐾' };

const AdoptionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    adoptionService
      .getById(id)
      .then((res) => setPet(res.data))
      .catch(() => navigate('/adoption'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleApply = async (formData) => {
    setIsSubmitting(true);
    try {
      await adoptionService.apply(id, formData);
      showToast('Application submitted! You can track its status from your dashboard.', 'success');
      setIsApplyOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      showToast('Please log in to apply for adoption', 'info');
      navigate('/login', { state: { from: { pathname: `/adoption/${id}` } } });
      return;
    }
    setIsApplyOpen(true);
  };

  if (loading) return <Loader fullScreen />;
  if (!pet) return null;

  const isFoster = pet.adoptionType === 'foster';
  const ctaLabel = isFoster ? 'Foster Me 🐾' : 'Adopt Me 🐾';

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
      <button
        onClick={() => navigate('/adoption')}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6"
      >
        <FiArrowLeft size={14} /> Back to Adoption
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="rounded-card overflow-hidden bg-secondary-light h-96 flex items-center justify-center">
          {pet.photos?.[0]?.url ? (
            <img src={pet.photos[0].url} alt={pet.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-7xl">{SPECIES_EMOJI[pet.species] || '🐾'}</span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-ink">{pet.name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isFoster ? 'bg-accent-light text-accent' : 'bg-primary-light text-primary'}`}>
              {isFoster ? 'Foster / Temporary' : 'Permanent Adoption'}
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                pet.status === 'available' ? 'bg-secondary-light text-secondary' : 'bg-border text-ink-muted'
              }`}
            >
              {pet.status}
            </span>
          </div>
          <p className="text-sm text-ink-muted capitalize mb-4">
            {pet.breed || pet.species} · {pet.gender}
            {pet.age?.years ? ` · ${pet.age.years}y ${pet.age.months || 0}m` : ''}
          </p>

          {pet.location?.city && (
            <p className="flex items-center gap-1.5 text-sm text-ink-muted mb-4">
              <FiMapPin size={14} /> {pet.location.city}{pet.location.state ? `, ${pet.location.state}` : ''}
            </p>
          )}

          <div className="flex gap-4 mb-5">
            <span className="flex items-center gap-1.5 text-sm">
              {pet.isVaccinated ? (
                <FiCheckCircle className="text-secondary" size={15} />
              ) : (
                <FiXCircle className="text-ink-muted" size={15} />
              )}
              Vaccinated
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              {pet.isNeutered ? (
                <FiCheckCircle className="text-secondary" size={15} />
              ) : (
                <FiXCircle className="text-ink-muted" size={15} />
              )}
              Neutered
            </span>
          </div>

          <p className="text-sm text-ink-muted leading-relaxed mb-4">{pet.description}</p>

          {pet.status === 'available' && (
            <Button className="w-full" onClick={handleApplyClick} icon={<FiHeart size={16} />}>
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-10">
        {pet.healthStatus && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-ink-muted uppercase mb-1">Health Status</p>
            <p className="text-sm text-ink">{pet.healthStatus}</p>
          </div>
        )}
        {pet.medicalHistory && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-ink-muted uppercase mb-1">Medical History</p>
            <p className="text-sm text-ink">{pet.medicalHistory}</p>
          </div>
        )}
        {pet.dietInfo && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-ink-muted uppercase mb-1">Diet & Feeding</p>
            <p className="text-sm text-ink">{pet.dietInfo}</p>
          </div>
        )}
        {pet.behaviorNotes && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-ink-muted uppercase mb-1">Temperament & Play</p>
            <p className="text-sm text-ink">{pet.behaviorNotes}</p>
          </div>
        )}
        {pet.reasonForRehoming && (
          <div className="card p-4 sm:col-span-2">
            <p className="text-xs font-semibold text-ink-muted uppercase mb-1">Why They Need a New Home</p>
            <p className="text-sm text-ink">{pet.reasonForRehoming}</p>
          </div>
        )}
      </div>

      <AdoptionApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSubmit={handleApply}
        isSubmitting={isSubmitting}
        petName={pet.name}
        adoptionType={pet.adoptionType}
      />
    </div>
  );
};

export default AdoptionDetailPage;
