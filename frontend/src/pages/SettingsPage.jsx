import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const SettingsPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSaving, setIsSaving] = useState(false);
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async ({ currentPassword, newPassword }) => {
    setIsSaving(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully', 'success');
      reset();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-ink">Settings</h1>

      <div className="card p-6">
        <h3 className="font-semibold text-ink mb-4">Change Password</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: 'Required' })}
          />
          <Input
            label="New password"
            type="password"
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'Required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
          />
          <Button type="submit" isLoading={isSaving}>Update Password</Button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-ink mb-2">Account</h3>
        <p className="text-sm text-ink-muted mb-4">Log out of PAWLX on this device.</p>
        <Button variant="danger" onClick={handleLogout}>Log Out</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
