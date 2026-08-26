import { useEffect, useState } from 'react';
import { FiBell, FiCalendar, FiShield, FiShoppingBag, FiHeart, FiTag, FiInfo } from 'react-icons/fi';
import { notificationService } from '@/services/miscServices';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

const TYPE_ICONS = {
  appointment: FiCalendar,
  medicine: FiShield,
  vaccination: FiShield,
  order: FiShoppingBag,
  booking: FiCalendar,
  adoption: FiHeart,
  promotion: FiTag,
  system: FiInfo,
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getMy();
      setNotifications(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    fetchNotifications();
  };

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>Mark all as read</Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={<FiBell size={32} />} title="You're all caught up" description="No notifications right now." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] || FiInfo;
            return (
              <button
                key={n._id}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
                className={`w-full text-left card p-4 flex items-start gap-3 ${!n.isRead ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="h-9 w-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{n.message}</p>
                  <p className="text-xs text-ink-muted mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
