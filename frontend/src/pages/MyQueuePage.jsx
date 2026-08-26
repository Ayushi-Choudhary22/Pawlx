import { useEffect, useState } from 'react';
import { FiCalendar, FiCheck, FiX, FiCheckCircle, FiVideo, FiSave } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { vetService, petSitterService, groomingService } from '@/services/bookingService';
import { ROLES } from '@/constants';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

const STATUS_COLORS = {
  pending: 'bg-accent-light text-accent',
  confirmed: 'bg-secondary-light text-secondary',
  accepted: 'bg-secondary-light text-secondary',
  completed: 'bg-primary-light text-primary',
  rejected: 'bg-red-100 text-red-500',
  cancelled: 'bg-border text-ink-muted',
};

const ROLE_CONFIG = {
  [ROLES.VETERINARIAN]: {
    title: 'Appointment Queue',
    service: vetService,
    acceptStatus: 'confirmed',
    describe: (item) =>
      `${item.pet?.name} · ${item.owner?.name} · ${new Date(item.date).toLocaleDateString()} at ${item.timeSlot}`,
    subtext: (item) => item.reason,
  },
  [ROLES.PET_SITTER]: {
    title: 'Booking Queue',
    service: petSitterService,
    acceptStatus: 'accepted',
    describe: (item) =>
      `${item.pet?.name} · ${item.owner?.name} · ${new Date(item.startDate).toLocaleDateString()} – ${new Date(item.endDate).toLocaleDateString()}`,
    subtext: (item) => item.instructions,
  },
  [ROLES.GROOMER]: {
    title: 'Booking Queue',
    service: groomingService,
    acceptStatus: 'confirmed',
    describe: (item) =>
      `${item.pet?.name} · ${item.owner?.name} · ${item.package} · ${new Date(item.date).toLocaleDateString()} at ${item.timeSlot}`,
    subtext: () => null,
  },
};

const MyQueuePage = () => {
  const { user } = useAuth();
  const config = ROLE_CONFIG[user?.role];
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [meetingLinkDrafts, setMeetingLinkDrafts] = useState({});
  const { showToast } = useToast();

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await config.service.getQueue(statusFilter || undefined);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await config.service.updateStatus(id, status);
      showToast(`Booking ${status}`, 'success');
      fetchQueue();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update booking', 'error');
    }
  };

  const handleSaveMeetingLink = async (item) => {
    const link = meetingLinkDrafts[item._id];
    if (!link) return;
    try {
      await vetService.updateStatus(item._id, item.status, { meetingLink: link });
      showToast('Meeting link saved', 'success');
      fetchQueue();
    } catch (error) {
      showToast('Failed to save meeting link', 'error');
    }
  };

  if (!config) {
    return (
      <EmptyState
        icon={<FiCalendar size={32} />}
        title="Not available"
        description="This page is only for veterinarians, pet sitters, and groomers."
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">{config.title}</h1>

      <div className="flex gap-2 mb-6">
        {['', 'pending', config.acceptStatus, 'completed'].map((status) => (
          <button
            key={status || 'all'}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              statusFilter === status ? 'bg-primary text-white' : 'bg-white border border-border text-ink-muted'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState icon={<FiCalendar size={32} />} title="No bookings here" description="New requests will show up in this queue." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="card p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{config.describe(item)}</p>
                  {config.subtext(item) && <p className="text-xs text-ink-muted mt-0.5">{config.subtext(item)}</p>}
                  {item.isVideoConsultation && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary mt-1">
                      <FiVideo size={12} /> Video consultation requested
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[item.status]}`}>
                    {item.status}
                  </span>
                  {item.status === 'pending' && (
                    <>
                      <Button size="sm" variant="secondary" icon={<FiCheck size={13} />} onClick={() => handleUpdateStatus(item._id, config.acceptStatus)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" icon={<FiX size={13} />} onClick={() => handleUpdateStatus(item._id, 'rejected')}>
                        Reject
                      </Button>
                    </>
                  )}
                  {(item.status === 'confirmed' || item.status === 'accepted') && (
                    <Button size="sm" variant="outline" icon={<FiCheckCircle size={13} />} onClick={() => handleUpdateStatus(item._id, 'completed')}>
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>

              {user.role === ROLES.VETERINARIAN && item.isVideoConsultation && item.status !== 'rejected' && item.status !== 'cancelled' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <input
                    type="url"
                    placeholder="Paste Zoom/Meet link for this consultation"
                    className="input text-sm"
                    defaultValue={item.meetingLink}
                    onChange={(e) => setMeetingLinkDrafts((prev) => ({ ...prev, [item._id]: e.target.value }))}
                  />
                  <Button size="sm" variant="outline" icon={<FiSave size={13} />} onClick={() => handleSaveMeetingLink(item)}>
                    Save
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQueuePage;
