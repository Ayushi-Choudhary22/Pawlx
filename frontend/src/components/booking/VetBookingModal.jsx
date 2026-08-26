import { useForm } from 'react-hook-form';
import { usePets } from '@/hooks/usePets';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const VetBookingModal = ({ isOpen, onClose, onSubmit, isSubmitting, vet }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { pets } = usePets();

  const handleFormSubmit = async (data) => {
    await onSubmit({ ...data, veterinarian: vet._id });
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book an Appointment with Dr. ${vet?.name}`}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="label">Select your pet</label>
          <select className="input" {...register('pet', { required: 'Please select a pet' })}>
            <option value="">Choose a pet</option>
            {pets.map((pet) => <option key={pet._id} value={pet._id}>{pet.name}</option>)}
          </select>
          {errors.pet && <p className="mt-1 text-xs text-red-500">{errors.pet.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date', { required: 'Required' })}
          />
          <Input
            label="Time slot"
            placeholder="e.g. 10:00 AM"
            error={errors.timeSlot?.message}
            {...register('timeSlot', { required: 'Required' })}
          />
        </div>

        <Input
          label="Reason for visit"
          placeholder="e.g. Annual checkup, vaccination"
          error={errors.reason?.message}
          {...register('reason', { required: 'Required' })}
        />

        {vet?.professionalProfile?.offersVideoConsultation && (
          <label className="flex items-center gap-2 text-sm text-ink bg-surface rounded-lg p-3">
            <input type="checkbox" {...register('isVideoConsultation')} />
            Request this as a video consultation instead of an in-person visit
          </label>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Request Appointment
        </Button>
      </form>
    </Modal>
  );
};

export default VetBookingModal;
