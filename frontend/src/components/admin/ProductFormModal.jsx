import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { categoryService } from '@/services/adminService';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const slugify = (name = '') => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const ProductFormModal = ({ isOpen, onClose, onSubmit, isSubmitting, defaultValues }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.list().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (isOpen) reset(defaultValues || {});
  }, [isOpen, defaultValues, reset]);

  const handleFormSubmit = (data) => {
    const { imageUrl, ...rest } = data;
    const payload = {
      ...rest,
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
      stock: Number(data.stock),
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    };
    if (!defaultValues) payload.slug = slugify(data.name);
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={defaultValues ? 'Edit Product' : 'Add Product'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input label="Product name" error={errors.name?.message} {...register('name', { required: 'Required' })} />

        <div>
          <label className="label">Category</label>
          <select className="input" {...register('category', { required: 'Required' })}>
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea rows={3} className="input resize-none" {...register('description', { required: 'Required' })} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input label="Price (₹)" type="number" error={errors.price?.message} {...register('price', { required: 'Required' })} />
          <Input label="Discount Price" type="number" {...register('discountPrice')} />
          <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock', { required: 'Required' })} />
        </div>

        <Input label="Image URL" placeholder="https://..." {...register('imageUrl')} />

        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" {...register('isFeatured')} /> Feature this product
        </label>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          {defaultValues ? 'Save Changes' : 'Create Product'}
        </Button>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
