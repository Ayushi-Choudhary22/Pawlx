import { useEffect, useState } from 'react';
import { FiHeart, FiFileText, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { adminService } from '@/services/adminService';
import { adoptionService } from '@/services/adoptionService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';

const AdoptionReviewTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await adminService.listPendingApplications();
      setApplications(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (appId, status) => {
    try {
      await adoptionService.reviewApplication(appId, status);
      showToast(`Application ${status}`, 'success');
      fetchApplications();
    } catch (error) {
      showToast('Failed to update application', 'error');
    }
  };

  if (loading) return <Loader />;

  if (applications.length === 0) {
    return <EmptyState icon={<FiHeart size={28} />} title="No pending applications" description="You're all caught up." />;
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => {
        const isExpanded = expandedId === app._id;
        return (
          <div key={app._id} className="card p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-medium text-ink">
                  {app.fullName || app.applicant?.name} → {app.adoption?.name} ({app.adoption?.species})
                </p>
                <p className="text-xs text-ink-muted mt-1 max-w-md">{app.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setExpandedId(isExpanded ? null : app._id)}>
                  {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                  Details
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleReview(app._id, 'approved')}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => handleReview(app._id, 'rejected')}>Reject</Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <p className="text-xs text-ink-muted">Full name</p>
                  <p className="text-ink">{app.fullName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Contact number</p>
                  <p className="text-ink">{app.contactNumber || '—'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-ink-muted">Permanent address</p>
                  <p className="text-ink">{app.permanentAddress || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Emergency contact</p>
                  <p className="text-ink">
                    {app.emergencyContactName ? `${app.emergencyContactName} — ${app.emergencyContactNumber || 'no number'}` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Responsibility acknowledged</p>
                  <p className="text-ink">{app.responsibilityAcknowledged ? 'Yes' : 'No'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-ink-muted">Previous pet experience</p>
                  <p className="text-ink">{app.previousPetExperience || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted mb-1">ID proof</p>
                  {app.idProof?.url ? (
                    <a
                      href={app.idProof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <FiFileText size={14} /> View uploaded document
                    </a>
                  ) : (
                    <p className="text-ink-muted">Not provided</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdoptionReviewTab;
