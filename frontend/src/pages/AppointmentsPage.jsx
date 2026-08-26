import { useEffect, useState } from 'react';
import { FiCalendar, FiVideo } from 'react-icons/fi';
import { vetService, petSitterService, groomingService } from '@/services/bookingService';
import { useToast } from '@/context/ToastContext';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

const TABS = [
  { key: 'vet', label: 'Vet Visits' },
  { key: 'sitter', label: 'Pet Sitters' },
  { key: 'grooming', label: 'Grooming' },
];

const STATUS_COLORS = {
  pending: 'bg-accent-light text-accent',
  confirmed: 'bg-secondary-light text-secondary',
  accepted: 'bg-secondary-light text-secondary',
  completed: 'bg-primary-light text-primary',
  rejected: 'bg-red-100 text-red-500',
  cancelled: 'bg-border text-ink-muted',
};

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState('vet');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'vet') {
        const res = await vetService.getMyAppointments();
        setItems(res.data);
      } else if (activeTab === 'sitter') {
        const res = await petSitterService.getMyBookings();
        setItems(res.data);
      } else {
        const res = await groomingService.getMyBookings();
        setItems(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCancel = async (id) => {
    try {
      if (activeTab === 'vet') await vetService.cancelAppointment(id, 'Cancelled by owner');
      else if (activeTab === 'sitter') await petSitterService.cancelBooking(id);
      else await groomingService.cancelBooking(id);
      showToast('Booking cancelled', 'success');
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to cancel', 'error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Appointments & Bookings</h1>

      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState icon={<FiCalendar size={32} />} title={`No ${TABS.find((t) => t.key === activeTab).label.toLowerCase()} yet`} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="card p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{item.pet?.name}</p>
                <p className="text-xs text-ink-muted">
                  {activeTab === 'vet' && `with Dr. ${item.veterinarian?.name} · ${new Date(item.date).toLocaleDateString()} at ${item.timeSlot}`}
                  {activeTab === 'sitter' && `with ${item.sitter?.name} · ${new Date(item.startDate).toLocaleDateString()} – ${new Date(item.endDate).toLocaleDateString()}`}
                  {activeTab === 'grooming' && `${item.package} with ${item.groomer?.name} · ${new Date(item.date).toLocaleDateString()} at ${item.timeSlot}`}
                </p>
                {activeTab === 'vet' && item.isVideoConsultation && (
                  <div className="mt-1.5">
                    {item.meetingLink ? (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                      >
                        <FiVideo size={12} /> Join Video Call
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                        <FiVideo size={12} /> Video link will appear here once the vet adds it
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[item.status]}`}>
                  {item.status}
                </span>
                {['pending', 'confirmed', 'accepted'].includes(item.status) && (
                  <Button size="sm" variant="outline" onClick={() => handleCancel(item._id)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
