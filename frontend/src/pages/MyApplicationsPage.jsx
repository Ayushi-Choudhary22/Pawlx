import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClipboard } from 'react-icons/fi';
import { adoptionService } from '@/services/adoptionService';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

const STATUS_COLORS = {
  pending: 'bg-accent-light text-accent',
  approved: 'bg-secondary-light text-secondary',
  rejected: 'bg-red-100 text-red-500',
};

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adoptionService
      .getMyApplications()
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<FiClipboard size={32} />}
        title="No adoption applications yet"
        description="Applications you submit will show up here so you can track their status."
        action={<Link to="/adoption"><Button>Browse Adoptable Pets</Button></Link>}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">My Adoption Applications</h1>
      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app._id} className="card p-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">{app.adoption?.name}</p>
                {app.adoption?.adoptionType && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${app.adoption.adoptionType === 'foster' ? 'bg-accent-light text-accent' : 'bg-primary-light text-primary'}`}>
                    {app.adoption.adoptionType === 'foster' ? 'Foster' : 'Adoption'}
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[app.status]}`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
