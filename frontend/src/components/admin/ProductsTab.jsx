import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import { productAdminService } from '@/services/adminService';
import { useToast } from '@/context/ToastContext';
import ProductFormModal from '@/components/admin/ProductFormModal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productAdminService.list({ limit: 50 });
      setProducts(res.data.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct({
      ...product,
      category: product.category?._id,
      imageUrl: product.images?.[0]?.url,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await productAdminService.update(editingProduct._id, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await productAdminService.create(payload);
        showToast('Product created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productAdminService.remove(id);
      showToast('Product removed', 'success');
      fetchProducts();
    } catch (error) {
      showToast('Failed to remove product', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" icon={<FiPlus size={14} />} onClick={openCreateModal}>Add Product</Button>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState icon={<FiPackage size={28} />} title="No products yet" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-ink-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-border">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=100&q=80'}
                      alt={product.name}
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                    <span className="font-medium text-ink">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{product.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-ink-muted">₹{product.discountPrice || product.price}</td>
                  <td className="px-4 py-3 text-ink-muted">{product.stock}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEditModal(product)} className="text-ink-muted hover:text-primary">
                      <FiEdit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-ink-muted hover:text-red-500">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        defaultValues={editingProduct}
      />
    </div>
  );
};

export default ProductsTab;
