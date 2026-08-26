import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiCalendar, FiShoppingBag, FiBell, FiPlus, FiZap } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/miscServices';
import DashboardCard from '@/components/dashboard/DashboardCard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';

const QUICK_ACTIONS = [
  { label: 'Add a Pet', path: '/pet-care', icon: FiPlus },
  { label: 'Book a Vet', path: '/vets', icon: FiCalendar },
  { label: 'Shop Marketplace', path: '/marketplace', icon: FiShoppingBag },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .get()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-ink-muted mt-1">Here&apos;s what&apos;s happening with your pets today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={<FiHeart size={18} />} label="My Pets" value={data?.totalPets ?? 0} />
        <DashboardCard
          icon={<FiCalendar size={18} />}
          label="Upcoming Appointments"
          value={data?.upcomingAppointments?.length ?? 0}
          accent="secondary"
        />
        <DashboardCard
          icon={<FiShoppingBag size={18} />}
          label="Recent Orders"
          value={data?.recentOrders?.length ?? 0}
          accent="accent"
        />
        <DashboardCard
          icon={<FiBell size={18} />}
          label="Unread Notifications"
          value={data?.unreadNotifications ?? 0}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-semibold text-ink mb-4">Upcoming Appointments</h3>
            {data?.upcomingAppointments?.length ? (
              <div className="space-y-3">
                {data.upcomingAppointments.map((appt) => (
                  <div key={appt._id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-ink">{appt.pet?.name}</p>
                      <p className="text-xs text-ink-muted">
                        with Dr. {appt.veterinarian?.name} · {new Date(appt.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light text-primary capitalize">
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No upcoming appointments" description="Book a vet visit to see it here." />
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-ink mb-4">Vaccination Reminders</h3>
            {data?.dueVaccinations?.length ? (
              <div className="space-y-3">
                {data.dueVaccinations.map((vac) => (
                  <div key={vac._id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-ink">{vac.pet?.name} — {vac.name}</p>
                      <p className="text-xs text-ink-muted">
                        Due {new Date(vac.nextDueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No upcoming vaccinations" description="You're all caught up." />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-ink mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {QUICK_ACTIONS.map(({ label, path, icon: Icon }) => (
                <Link key={path} to={path}>
                  <Button variant="outline" className="w-full justify-start" icon={<Icon size={16} />}>
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="bg-primary text-white border-none">
            <div className="flex items-center gap-2 mb-2">
              <FiZap size={16} />
              <h3 className="font-semibold">AI Tip of the Day</h3>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              Regular dental check-ups can prevent up to 80% of common oral health issues in pets.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
