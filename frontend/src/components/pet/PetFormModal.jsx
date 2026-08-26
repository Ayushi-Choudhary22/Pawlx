import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SPECIES_OPTIONS } from '@/constants';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const PetFormModal = ({ isOpen, onClose, onSubmit, isSubmitting, defaultValues }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  useEffect(() => {
    if (isOpen) reset(defaultValues || {});
  }, [isOpen, defaultValues, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={defaultValues ? 'Edit Pet' : 'Add a New Pet'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Pet name"
          placeholder="e.g. Bruno"
          error={errors.name?.message}
          {...register('name', { required: 'Pet name is required' })}
        />

        <div>
          <label className="label">Species</label>
          <select className="input" {...register('species', { required: true })}>
            {SPECIES_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Breed" placeholder="e.g. Labrador" {...register('breed')} />
          <div>
            <label className="label">Gender</label>
            <select className="input" {...register('gender')}>
              <option value="unknown">Unknown</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Birth date" type="date" {...register('birthDate')} />
          <Input label="Color" placeholder="e.g. Golden" {...register('color')} />
        </div>

        <Input label="Owner notes" placeholder="Any notes about your pet" {...register('ownerNotes')} />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          {defaultValues ? 'Save Changes' : 'Add Pet'}
        </Button>
      </form>
    </Modal>
  );
};

export default PetFormModal;
