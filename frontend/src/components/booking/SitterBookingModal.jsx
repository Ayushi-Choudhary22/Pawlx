import { useForm } from 'react-hook-form';
import { usePets } from '@/hooks/usePets';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const SitterBookingModal = ({ isOpen, onClose, onSubmit, isSubmitting, sitter }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { pets } = usePets();

  const handleFormSubmit = async (data) => {
    await onSubmit({ ...data, sitter: sitter._id });
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${sitter?.name} as a Pet Sitter`}>
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
            label="Start date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate', { required: 'Required' })}
          />
          <Input
            label="End date"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate', { required: 'Required' })}
          />
        </div>

        <Input label="Special instructions" placeholder="Feeding schedule, routines, etc." {...register('instructions')} />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Request Booking
        </Button>
      </form>
    </Modal>
  );
};

export default SitterBookingModal;
