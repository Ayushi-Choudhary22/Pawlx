import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/context/ToastContext';
import SearchBar from '@/components/common/SearchBar';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.listUsers({ search: search || undefined });
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleToggleActive = async (user) => {
    try {
      await adminService.toggleUserActive(user._id, !user.isActive);
      showToast(`User ${user.isActive ? 'deactivated' : 'activated'}`, 'success');
      fetchUsers();
    } catch (error) {
      showToast('Failed to update user status', 'error');
    }
  };

  const handleApprove = async (user) => {
    try {
      await adminService.approveProfessional(user._id);
      showToast('Professional approved', 'success');
      fetchUsers();
    } catch (error) {
      showToast('Failed to approve professional', 'error');
    }
  };

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." className="max-w-sm mb-4" />

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-ink-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{user.name}</p>
                    <p className="text-xs text-ink-muted">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-muted">{user.role.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-secondary-light text-secondary' : 'bg-red-100 text-red-500'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {user.role !== 'pet_owner' && user.role !== 'admin' && !user.professionalProfile?.isApproved && (
                      <span className="ml-2 text-xs px-2 py-1 rounded-full bg-accent-light text-accent">Pending Approval</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {user.role !== 'pet_owner' && user.role !== 'admin' && !user.professionalProfile?.isApproved && (
                      <Button size="sm" variant="secondary" onClick={() => handleApprove(user)}>Approve</Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleToggleActive(user)}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
