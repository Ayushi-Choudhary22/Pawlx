import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import { orderService } from '@/services/marketplaceService';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

const STATUS_COLORS = {
  placed: 'bg-primary-light text-primary',
  processing: 'bg-accent-light text-accent',
  shipped: 'bg-accent-light text-accent',
  delivered: 'bg-secondary-light text-secondary',
  cancelled: 'bg-red-100 text-red-500',
  returned: 'bg-border text-ink-muted',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<FiPackage size={32} />}
        title="No orders yet"
        description="Your order history will show up here."
        action={<Link to="/marketplace"><Button>Start Shopping</Button></Link>}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="card p-4 flex items-center justify-between block">
            <div>
              <p className="text-sm font-medium text-ink">#{order.orderNumber}</p>
              <p className="text-xs text-ink-muted">
                {order.items.length} item{order.items.length > 1 ? 's' : ''} · ₹{order.totalPrice} ·{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
              {order.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
