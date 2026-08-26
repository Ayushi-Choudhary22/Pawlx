import { useForm } from 'react-hook-form';
import { usePets } from '@/hooks/usePets';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const GROOMING_PACKAGES = ['Basic Bath & Brush', 'Full Grooming', 'Nail Trim & Ear Cleaning', 'Deluxe Spa Package'];

const GroomingBookingModal = ({ isOpen, onClose, onSubmit, isSubmitting, groomer }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { pets } = usePets();

  const handleFormSubmit = async (data) => {
    await onSubmit({ ...data, groomer: groomer._id });
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book Grooming with ${groomer?.name}`}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="label">Select your pet</label>
          <select className="input" {...register('pet', { required: 'Please select a pet' })}>
            <option value="">Choose a pet</option>
            {pets.map((pet) => <option key={pet._id} value={pet._id}>{pet.name}</option>)}
          </select>
          {errors.pet && <p className="mt-1 text-xs text-red-500">{errors.pet.message}</p>}
        </div>

        <div>
          <label className="label">Package</label>
          <select className="input" {...register('package', { required: 'Required' })}>
            {GROOMING_PACKAGES.map((pkg) => <option key={pkg} value={pkg}>{pkg}</option>)}
          </select>
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
            placeholder="e.g. 2:00 PM"
            error={errors.timeSlot?.message}
            {...register('timeSlot', { required: 'Required' })}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Request Booking
        </Button>
      </form>
    </Modal>
  );
};

export default GroomingBookingModal;
