import { useState } from 'react';
import { FiPlus, FiHeart } from 'react-icons/fi';
import { usePets } from '@/hooks/usePets';
import { useToast } from '@/context/ToastContext';
import PetCard from '@/components/pet/PetCard';
import PetFormModal from '@/components/pet/PetFormModal';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonLoader';

const PetCarePage = () => {
  const { pets, loading, addPet } = usePets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleAddPet = async (formData) => {
    setIsSubmitting(true);
    try {
      await addPet(formData);
      showToast('Pet added successfully!', 'success');
      setIsModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add pet', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Pet Care</h1>
          <p className="text-sm text-ink-muted mt-1">Manage profiles, health records and reminders.</p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={() => setIsModalOpen(true)}>
          Add Pet
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          icon={<FiHeart size={32} />}
          title="No pets added yet"
          description="Add your first pet to start tracking their health and bookings."
          action={<Button onClick={() => setIsModalOpen(true)}>Add Your First Pet</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
        </div>
      )}

      <PetFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPet}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PetCarePage;
