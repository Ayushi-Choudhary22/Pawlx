import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { adoptionService } from '@/services/adoptionService';
import { useToast } from '@/context/ToastContext';
import { SPECIES_OPTIONS } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const ListPetForAdoptionPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { species: 'dog', gender: 'unknown', adoptionType: 'permanent' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const adoptionType = watch('adoptionType');

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const {
        ageYears, ageMonths, city, state,
        name, species, breed, gender, description, healthStatus,
        reasonForRehoming, dietInfo, behaviorNotes, medicalHistory,
        contactNumber, isVaccinated, isNeutered, adoptionType: type,
      } = formData;

      const payload = {
        name, species, breed, gender, description, healthStatus,
        reasonForRehoming, dietInfo, behaviorNotes, medicalHistory,
        contactNumber,
        adoptionType: type,
        age: { years: Number(ageYears) || 0, months: Number(ageMonths) || 0 },
        location: { city, state },
        isVaccinated: !!isVaccinated,
        isNeutered: !!isNeutered,
      };
      const res = await adoptionService.create(payload);
      showToast('Listing created successfully!', 'success');
      navigate(`/adoption/${res.data._id}`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create listing', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-1">List a Pet</h1>
      <p className="text-sm text-ink-muted mb-6">
        Share your pet's story so the right person can find them.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
        <div>
          <label className="label">Is this a permanent adoption or temporary fostering?</label>
          <div className="grid grid-cols-2 gap-2">
            <label
              className={`flex items-center justify-center rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                adoptionType === 'permanent' ? 'border-primary bg-primary-light text-primary font-medium' : 'border-border text-ink-muted'
              }`}
            >
              <input type="radio" value="permanent" className="hidden" {...register('adoptionType')} />
              Permanent Adoption
            </label>
            <label
              className={`flex items-center justify-center rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                adoptionType === 'foster' ? 'border-accent bg-accent-light text-accent font-medium' : 'border-border text-ink-muted'
              }`}
            >
              <input type="radio" value="foster" className="hidden" {...register('adoptionType')} />
              Foster / Temporary
            </label>
          </div>
        </div>

        <div>
          <label className="label">Why are you rehoming this pet? (optional, but helps build trust)</label>
          <textarea
            rows={2}
            className="input resize-none"
            placeholder="e.g. Relocating for work and can't take them along, temporarily unable to care for them while..."
            {...register('reasonForRehoming')}
          />
        </div>

        <div className="border-t border-border pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-ink">About the pet</h3>

          <Input
            label="Pet name"
            error={errors.name?.message}
            {...register('name', { required: 'Required' })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Species</label>
              <select className="input" {...register('species')}>
                {SPECIES_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <Input label="Breed" {...register('breed')} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Gender</label>
              <select className="input" {...register('gender')}>
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <Input label="Age (years)" type="number" {...register('ageYears')} />
            <Input label="Age (months)" type="number" {...register('ageMonths')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="City" error={errors.city?.message} {...register('city', { required: 'Required' })} />
            <Input label="State" {...register('state')} />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              rows={3}
              className="input resize-none"
              placeholder="Temperament, background, what kind of home they'd thrive in..."
              {...register('description', { required: 'Required' })}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>
        </div>

        <div className="border-t border-border pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-ink">Care details</h3>

          <div>
            <label className="label">Food & feeding habits</label>
            <textarea
              rows={2}
              className="input resize-none"
              placeholder="What do they eat, how often, any favorite treats..."
              {...register('dietInfo')}
            />
          </div>

          <div>
            <label className="label">Toys, play & temperament</label>
            <textarea
              rows={2}
              className="input resize-none"
              placeholder="Favorite toys, how they play, energy level, how they are with kids/other pets..."
              {...register('behaviorNotes')}
            />
          </div>

          <div>
            <label className="label">Medical history</label>
            <textarea
              rows={2}
              className="input resize-none"
              placeholder="Past checkups, hospital visits, ongoing conditions or medication..."
              {...register('medicalHistory')}
            />
          </div>

          <Input label="Health status (short summary)" placeholder="e.g. Healthy, up to date on checkups" {...register('healthStatus')} />

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" {...register('isVaccinated')} /> Vaccinated
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" {...register('isNeutered')} /> Neutered / Spayed
            </label>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <Input
            label="Your contact number"
            type="tel"
            placeholder="So interested adopters/fosters can reach you directly"
            {...register('contactNumber')}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Listing
        </Button>
      </form>
    </div>
  );
};

export default ListPetForAdoptionPage;
