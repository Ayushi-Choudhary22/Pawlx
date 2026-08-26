import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import { petService } from '@/services/petService';
import { useToast } from '@/context/ToastContext';
import Loader from '@/components/common/Loader';
import Button from '@/components/common/Button';
import PetFormModal from '@/components/pet/PetFormModal';
import VaccinationTab from '@/components/pet/VaccinationTab';
import MedicineTab from '@/components/pet/MedicineTab';
import MedicalHistoryTab from '@/components/pet/MedicalHistoryTab';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'vaccinations', label: 'Vaccinations' },
  { key: 'medicines', label: 'Medicines' },
  { key: 'history', label: 'Medical History' },
];

const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', bird: '🐦', rabbit: '🐰', fish: '🐠', reptile: '🦎', other: '🐾' };

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchPet = async () => {
    setLoading(true);
    try {
      const res = await petService.getPetById(id);
      setPet(res.data);
    } catch (error) {
      showToast('Pet not found', 'error');
      navigate('/pet-care');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEdit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await petService.updatePet(id, formData);
      setPet(res.data);
      showToast('Pet profile updated', 'success');
      setIsEditOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Update failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!pet) return null;

  return (
    <div>
      <button
        onClick={() => navigate('/pet-care')}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <FiArrowLeft size={14} /> Back to Pet Care
      </button>

      <div className="card p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary-light flex items-center justify-center overflow-hidden text-3xl shrink-0">
            {pet.photo?.url ? (
              <img src={pet.photo.url} alt={pet.name} className="h-full w-full object-cover" />
            ) : (
              SPECIES_EMOJI[pet.species] || '🐾'
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">{pet.name}</h1>
            <p className="text-sm text-ink-muted capitalize">
              {pet.breed || pet.species} · {pet.gender}
              {pet.weight?.value ? ` · ${pet.weight.value}${pet.weight.unit}` : ''}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" icon={<FiEdit2 size={14} />} onClick={() => setIsEditOpen(true)}>
          Edit Profile
        </Button>
      </div>

      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-xs text-ink-muted mb-1">Medical Conditions</p>
            <p className="text-sm text-ink">
              {pet.medicalConditions?.length ? pet.medicalConditions.join(', ') : 'None recorded'}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-ink-muted mb-1">Allergies</p>
            <p className="text-sm text-ink">{pet.allergies?.length ? pet.allergies.join(', ') : 'None recorded'}</p>
          </div>
          <div className="card p-4 sm:col-span-2">
            <p className="text-xs text-ink-muted mb-1">Owner Notes</p>
            <p className="text-sm text-ink">{pet.ownerNotes || 'No notes added yet.'}</p>
          </div>
        </div>
      )}

      {activeTab === 'vaccinations' && <VaccinationTab petId={pet._id} />}
      {activeTab === 'medicines' && <MedicineTab petId={pet._id} />}
      {activeTab === 'history' && <MedicalHistoryTab petId={pet._id} />}

      <PetFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
        defaultValues={pet}
      />
    </div>
  );
};

export default PetDetailPage;
