import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { categoryService } from '@/services/adminService';
import { useToast } from '@/context/ToastContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { showToast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.list();
      setCategories(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (formData) => {
    try {
      await categoryService.create(formData);
      showToast('Category created', 'success');
      reset();
      fetchCategories();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create category', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.remove(id);
      showToast('Category removed', 'success');
      fetchCategories();
    } catch (error) {
      showToast('Failed to remove category', 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat._id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{cat.name}</p>
                <p className="text-xs text-ink-muted">{cat.description || 'No description'}</p>
              </div>
              <button onClick={() => handleDelete(cat._id)} className="text-ink-muted hover:text-red-500">
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 space-y-3 h-fit">
        <h4 className="text-sm font-semibold text-ink">Add Category</h4>
        <Input
          label="Name"
          error={errors.name?.message}
          {...register('name', { required: 'Required' })}
        />
        <Input label="Description" {...register('description')} />
        <Button type="submit" size="sm" className="w-full" icon={<FiPlus size={14} />}>
          Add Category
        </Button>
      </form>
    </div>
  );
};

export default CategoriesTab;
