import { useForm } from 'react-hook-form';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

/**
 * Full adopter verification form. None of this can be cryptographically verified
 * by the app — it's collected so the listing owner/admin has enough information
 * to make a responsible placement decision on manual review.
 */
const AdoptionApplyModal = ({ isOpen, onClose, onSubmit, isSubmitting, petName, adoptionType = 'permanent' }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('permanentAddress', data.permanentAddress);
    formData.append('contactNumber', data.contactNumber);
    formData.append('emergencyContactName', data.emergencyContactName || '');
    formData.append('emergencyContactNumber', data.emergencyContactNumber || '');
    formData.append('previousPetExperience', data.previousPetExperience || '');
    formData.append('message', data.message || '');
    formData.append('responsibilityAcknowledged', data.responsibilityAcknowledged ? 'true' : 'false');
    if (data.idProof?.[0]) {
      formData.append('idProof', data.idProof[0]);
    }

    await onSubmit(formData);
    reset();
  };

  const actionLabel = adoptionType === 'foster' ? 'Foster' : 'Adopt';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${actionLabel} ${petName}`} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Your Details</h4>
          <div className="space-y-3">
            <Input
              label="Full name"
              error={errors.fullName?.message}
              {...register('fullName', { required: 'Full name is required' })}
            />
            <div>
              <label className="label">Permanent address</label>
              <textarea
                rows={2}
                className="input resize-none"
                placeholder="House/flat, street, city, state, PIN code"
                {...register('permanentAddress', { required: 'Permanent address is required' })}
              />
              {errors.permanentAddress && <p className="mt-1 text-xs text-red-500">{errors.permanentAddress.message}</p>}
            </div>
            <Input
              label="Contact number"
              type="tel"
              error={errors.contactNumber?.message}
              {...register('contactNumber', { required: 'Contact number is required' })}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">In Case We Can't Reach You</h4>
          <p className="text-xs text-ink-muted mb-3">
            A family member or friend's contact — optional, but helps in an emergency.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Their name" {...register('emergencyContactName')} />
            <Input label="Their number" type="tel" {...register('emergencyContactNumber')} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Identity Verification</h4>
          <label className="label">Upload a government ID (photo or PDF)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            className="input"
            {...register('idProof', { required: 'An ID proof document is required' })}
          />
          {errors.idProof && <p className="mt-1 text-xs text-red-500">{errors.idProof.message}</p>}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">A Bit About You</h4>
          <div className="space-y-3">
            <div>
              <label className="label">Previous pet experience</label>
              <textarea
                rows={2}
                className="input resize-none"
                placeholder="Have you cared for a pet before? What kind, for how long?"
                {...register('previousPetExperience')}
              />
            </div>
            <div>
              <label className="label">Why would you be a great fit for {petName}?</label>
              <textarea
                rows={3}
                className="input resize-none"
                placeholder="Share a bit about your home and why you'd like to adopt..."
                {...register('message', { required: 'Please share a short message' })}
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-ink bg-surface rounded-lg p-3">
          <input type="checkbox" className="mt-0.5" {...register('responsibilityAcknowledged', { required: true })} />
          <span>
            I understand that if approved, I will be fully responsible for this pet's health, safety, and
            wellbeing, and will provide proper care, food, and veterinary attention for as long as I have them.
          </span>
        </label>
        {errors.responsibilityAcknowledged && (
          <p className="text-xs text-red-500 -mt-3">You must acknowledge this to submit your application</p>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Submit {actionLabel} Application
        </Button>
      </form>
    </Modal>
  );
};

export default AdoptionApplyModal;
