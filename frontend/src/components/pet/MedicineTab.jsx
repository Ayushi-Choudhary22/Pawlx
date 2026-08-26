import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiActivity } from 'react-icons/fi';
import { petService } from '@/services/petService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';

const FREQUENCY_OPTIONS = [
  { value: 'once_daily', label: 'Once daily' },
  { value: 'twice_daily', label: 'Twice daily' },
  { value: 'thrice_daily', label: 'Thrice daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as_needed', label: 'As needed' },
];

const MedicineTab = ({ petId }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { showToast } = useToast();

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await petService.getMedicines(petId);
      setMedicines(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const onSubmit = async (formData) => {
    try {
      await petService.addMedicine(petId, formData);
      showToast('Medicine reminder added', 'success');
      reset();
      setShowForm(false);
      fetchMedicines();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add reminder', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-ink">Medicine Reminders</h3>
        <Button size="sm" icon={<FiPlus size={14} />} onClick={() => setShowForm(!showForm)}>
          Add Reminder
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Medicine name"
              placeholder="e.g. Heartgard"
              error={errors.name?.message}
              {...register('name', { required: 'Required' })}
            />
            <Input
              label="Dosage"
              placeholder="e.g. 1 tablet"
              error={errors.dosage?.message}
              {...register('dosage', { required: 'Required' })}
            />
          </div>
          <div>
            <label className="label">Frequency</label>
            <select className="input" {...register('frequency')}>
              {FREQUENCY_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start date"
              type="date"
              error={errors.startDate?.message}
              {...register('startDate', { required: 'Required' })}
            />
            <Input label="End date" type="date" {...register('endDate')} />
          </div>
          <Button type="submit" size="sm">Save Reminder</Button>
        </form>
      )}

      {medicines.length === 0 ? (
        <EmptyState icon={<FiActivity size={28} />} title="No medicine reminders yet" />
      ) : (
        <div className="space-y-3">
          {medicines.map((m) => (
            <div key={m._id} className="card p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-ink text-sm">{m.name}</p>
                <p className="text-xs text-ink-muted">
                  {m.dosage} · {m.frequency.replace('_', ' ')}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full ${
                  m.isActive ? 'bg-secondary-light text-secondary' : 'bg-border text-ink-muted'
                }`}
              >
                {m.isActive ? 'Active' : 'Ended'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineTab;
