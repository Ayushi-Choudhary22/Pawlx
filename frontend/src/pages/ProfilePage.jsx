import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCamera } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { userService } from '@/services/userService';
import { ROLES } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const PROFESSIONAL_ROLES = [ROLES.VETERINARIAN, ROLES.PET_SITTER, ROLES.GROOMER];

const ProfilePage = () => {
  const { user, updateUserInContext } = useAuth();
  const isProfessional = PROFESSIONAL_ROLES.includes(user?.role);
  const profile = user?.professionalProfile || {};

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
      aadharNumber: user?.aadharNumber,
      street: user?.address?.street,
      city: user?.address?.city,
      state: user?.address?.state,
      zipCode: user?.address?.zipCode,
      bio: profile.bio,
      experienceYears: profile.experienceYears,
      consultationFee: profile.consultationFee,
      profCity: profile.city,
      clinicAddress: profile.clinicAddress,
      offersVideoConsultation: profile.offersVideoConsultation,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const onSubmit = async (formData) => {
    setIsSaving(true);
    try {
      const { name, phone, street, city, state, zipCode, aadharNumber } = formData;
      const payload = {
        name,
        phone,
        aadharNumber,
        address: { street, city, state, zipCode },
      };

      if (isProfessional) {
        payload.professionalProfile = {
          ...profile,
          bio: formData.bio,
          experienceYears: formData.experienceYears ? Number(formData.experienceYears) : profile.experienceYears,
          consultationFee: formData.consultationFee ? Number(formData.consultationFee) : profile.consultationFee,
          city: formData.profCity,
          clinicAddress: formData.clinicAddress,
          offersVideoConsultation: !!formData.offersVideoConsultation,
        };
      }

      const res = await userService.updateProfile(payload);
      updateUserInContext(res.data);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await userService.uploadAvatar(formData);
      updateUserInContext(res.data);
      showToast('Profile picture updated', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to upload picture', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink mb-6">Profile</h1>

      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-primary-light overflow-hidden flex items-center justify-center text-2xl font-semibold text-primary">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              user?.name?.[0]
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white"
          >
            <FiCamera size={12} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <h3 className="font-semibold text-ink">{user?.name}</h3>
          <p className="text-sm text-ink-muted">{user?.email}</p>
          <div className="flex gap-2 mt-1.5 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary capitalize font-medium">
              {user?.role?.replace('_', ' ')}
            </span>
            {user?.isVerified ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                ✓ Verified Profile
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                ✗ Verification Required
              </span>
            )}
          </div>
        </div>
      </div>

      {!user?.isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm mb-4">
          <strong>Verification Required:</strong> To access the **Temporary Pet Adoption** features, please save a valid 12-digit Aadhar Card Number and your location (City/State) in your profile.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <Input label="Full name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Phone number" {...register('phone')} />
          <Input 
            label="Aadhar Card Number" 
            placeholder="12-digit number (for dummy verification)" 
            error={errors.aadharNumber?.message}
            {...register('aadharNumber', {
              pattern: {
                value: /^\d{12}$/,
                message: 'Aadhar must be exactly 12-digit number',
              }
            })} 
          />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-2">Address</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Street" className="col-span-2" {...register('street')} />
            <Input label="City" {...register('city')} />
            <Input label="State" {...register('state')} />
            <Input label="Zip Code" {...register('zipCode')} />
          </div>
        </div>

        {isProfessional && (
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-ink mb-2">Professional Details</h4>
            <p className="text-xs text-ink-muted mb-3">
              This is what pet owners see on your public profile and when booking with you.
            </p>
            <div className="space-y-3">
              <div>
                <label className="label">Bio</label>
                <textarea
                  rows={3}
                  className="input resize-none"
                  placeholder="Tell pet owners about your experience and approach to care..."
                  {...register('bio')}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Years of experience" type="number" {...register('experienceYears')} />
                <Input label="Consultation fee (₹)" type="number" {...register('consultationFee')} />
              </div>
              <Input label="City" {...register('profCity')} />
              <div>
                <label className="label">Clinic / visiting address</label>
                <textarea
                  rows={2}
                  className="input resize-none"
                  placeholder="Full address where pet owners can visit you in person"
                  {...register('clinicAddress')}
                />
              </div>
              {user?.role === ROLES.VETERINARIAN && (
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" {...register('offersVideoConsultation')} />
                  I offer video consultations
                </label>
              )}
            </div>
          </div>
        )}

        <Button type="submit" isLoading={isSaving}>Save Changes</Button>
      </form>
    </div>
  );
};

export default ProfilePage;
