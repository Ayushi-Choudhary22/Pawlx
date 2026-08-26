import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { cartService } from '@/services/marketplaceService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartService.get();
      setCart(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartService.updateQuantity(productId, quantity);
      setCart(res.data);
    } catch (error) {
      showToast('Failed to update quantity', 'error');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await cartService.removeItem(productId);
      setCart(res.data);
      showToast('Item removed', 'success');
    } catch (error) {
      showToast('Failed to remove item', 'error');
    }
  };

  if (loading) return <Loader fullScreen />;

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20">
        <EmptyState
          icon={<FiShoppingCart size={32} />}
          title="Your cart is empty"
          description="Browse the marketplace to find something for your pet."
          action={<Link to="/marketplace"><Button>Browse Marketplace</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-6">Your Cart</h1>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product._id} className="card p-4 flex items-center gap-4">
              <img
                src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=200&q=80'}
                alt={item.product.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{item.product.name}</p>
                <p className="text-xs text-ink-muted">₹{item.priceAtAdd} each</p>
              </div>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className="px-2.5 py-1.5 text-ink-muted"
                >
                  −
                </button>
                <span className="px-3 text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="px-2.5 py-1.5 text-ink-muted"
                >
                  +
                </button>
              </div>
              <button onClick={() => removeItem(item.product._id)} className="text-ink-muted hover:text-red-500">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-5 h-fit">
          <h3 className="font-semibold text-ink mb-4">Order Summary</h3>
          <div className="flex justify-between text-sm text-ink-muted mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-muted mb-4">
            <span>Shipping</span>
            <span>{subtotal > 999 ? 'Free' : '₹49'}</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between font-semibold text-ink mb-5">
            <span>Total</span>
            <span>₹{subtotal + (subtotal > 999 ? 0 : 49)}</span>
          </div>
          <Button className="w-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
