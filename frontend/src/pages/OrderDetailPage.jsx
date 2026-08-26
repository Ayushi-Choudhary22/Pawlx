import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { orderService } from '@/services/marketplaceService';
import Loader from '@/components/common/Loader';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Loader fullScreen />;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <FiArrowLeft size={14} /> Back to Orders
      </button>

      <div className="card p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-lg font-bold text-ink">Order #{order.orderNumber}</h1>
            <p className="text-xs text-ink-muted">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light text-primary capitalize">
            {order.status}
          </span>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-ink">{item.name} × {item.quantity}</span>
              <span className="text-ink-muted">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-ink-muted">
            <span>Items</span><span>₹{order.itemsPrice}</span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>Shipping</span><span>₹{order.shippingPrice}</span>
          </div>
          <div className="flex justify-between font-semibold text-ink pt-1.5">
            <span>Total</span><span>₹{order.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-ink mb-4">Order Tracking</h3>
        <div className="relative pl-6 space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {order.trackingHistory.map((track, i) => (
            <div key={i} className="relative">
              <FiCheckCircle className="absolute -left-6 top-0.5 text-secondary bg-white" size={15} />
              <p className="text-sm font-medium text-ink capitalize">{track.status}</p>
              {track.note && <p className="text-xs text-ink-muted">{track.note}</p>}
              <p className="text-xs text-ink-muted">{new Date(track.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
