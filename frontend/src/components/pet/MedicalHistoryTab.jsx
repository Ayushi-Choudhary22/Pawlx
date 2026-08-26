import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiFileText } from 'react-icons/fi';
import { petService } from '@/services/petService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';

const RECORD_TYPES = ['checkup', 'diagnosis', 'surgery', 'lab_result', 'growth', 'other'];

const MedicalHistoryTab = ({ petId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { showToast } = useToast();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await petService.getMedicalRecords(petId);
      setRecords(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const onSubmit = async (formData) => {
    try {
      await petService.addMedicalRecord(petId, formData);
      showToast('Medical record added', 'success');
      reset();
      setShowForm(false);
      fetchRecords();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add record', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-ink">Medical History</h3>
        <Button size="sm" icon={<FiPlus size={14} />} onClick={() => setShowForm(!showForm)}>
          Add Record
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-4 mb-4 space-y-3">
          <Input
            label="Title"
            placeholder="e.g. Annual Checkup"
            error={errors.title?.message}
            {...register('title', { required: 'Required' })}
          />
          <div>
            <label className="label">Record type</label>
            <select className="input" {...register('recordType')}>
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <Input label="Description" placeholder="Notes from the visit" {...register('description')} />
          <Input label="Weight (kg)" type="number" step="0.1" {...register('weight')} />
          <Button type="submit" size="sm">Save Record</Button>
        </form>
      )}

      {records.length === 0 ? (
        <EmptyState icon={<FiFileText size={28} />} title="No medical records yet" />
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {records.map((r) => (
            <div key={r._id} className="relative">
              <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-white" />
              <p className="text-xs text-ink-muted mb-0.5">{new Date(r.recordDate).toLocaleDateString()}</p>
              <p className="font-medium text-ink text-sm capitalize">{r.title}</p>
              {r.description && <p className="text-sm text-ink-muted mt-1">{r.description}</p>}
              <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary capitalize">
                {r.recordType.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryTab;
