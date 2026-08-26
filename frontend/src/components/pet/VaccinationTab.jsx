import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiShield } from 'react-icons/fi';
import { petService } from '@/services/petService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';

const VaccinationTab = ({ petId }) => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { showToast } = useToast();

  const fetchVaccinations = async () => {
    setLoading(true);
    try {
      const res = await petService.getVaccinations(petId);
      setVaccinations(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccinations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const onSubmit = async (formData) => {
    try {
      await petService.addVaccination(petId, formData);
      showToast('Vaccination record added', 'success');
      reset();
      setShowForm(false);
      fetchVaccinations();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add record', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-ink">Vaccination Records</h3>
        <Button size="sm" icon={<FiPlus size={14} />} onClick={() => setShowForm(!showForm)}>
          Add Record
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-4 mb-4 space-y-3">
          <Input
            label="Vaccine name"
            placeholder="e.g. Rabies"
            error={errors.name?.message}
            {...register('name', { required: 'Vaccine name is required' })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date administered"
              type="date"
              error={errors.dateAdministered?.message}
              {...register('dateAdministered', { required: 'Required' })}
            />
            <Input label="Next due date" type="date" {...register('nextDueDate')} />
          </div>
          <Input label="Administered by" placeholder="Vet / clinic name" {...register('administeredBy')} />
          <Button type="submit" size="sm">Save Record</Button>
        </form>
      )}

      {vaccinations.length === 0 ? (
        <EmptyState icon={<FiShield size={28} />} title="No vaccination records yet" />
      ) : (
        <div className="space-y-3">
          {vaccinations.map((v) => (
            <div key={v._id} className="card p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-ink text-sm">{v.name}</p>
                <p className="text-xs text-ink-muted">
                  Given {new Date(v.dateAdministered).toLocaleDateString()}
                  {v.nextDueDate && ` · Next due ${new Date(v.nextDueDate).toLocaleDateString()}`}
                </p>
              </div>
              {v.administeredBy && <span className="text-xs text-ink-muted">{v.administeredBy}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaccinationTab;
