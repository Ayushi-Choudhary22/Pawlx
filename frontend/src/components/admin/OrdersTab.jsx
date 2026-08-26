import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { FiPackage } from 'react-icons/fi';

const STATUS_COLORS = {
  placed: 'bg-primary-light text-primary',
  processing: 'bg-accent-light text-accent',
  shipped: 'bg-accent-light text-accent',
  delivered: 'bg-secondary-light text-secondary',
  cancelled: 'bg-red-100 text-red-500',
  returned: 'bg-border text-ink-muted',
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .listAllOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (orders.length === 0) return <EmptyState icon={<FiPackage size={28} />} title="No orders yet" />;

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface text-ink-muted text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-3">Order</th>
            <th className="text-left px-4 py-3">Customer</th>
            <th className="text-left px-4 py-3">Total</th>
            <th className="text-left px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t border-border">
              <td className="px-4 py-3 font-medium text-ink">#{order.orderNumber}</td>
              <td className="px-4 py-3 text-ink-muted">{order.user?.name}</td>
              <td className="px-4 py-3 text-ink-muted">₹{order.totalPrice}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTab;
