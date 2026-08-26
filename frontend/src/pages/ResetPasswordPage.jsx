import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '@/services/authService';
import { useToast } from '@/context/ToastContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const ResetPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async ({ password }) => {
    if (!token) {
      showToast('Reset link is invalid or missing a token', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(token, password);
      showToast('Password reset successfully. Please log in.', 'success');
      navigate('/login');
    } catch (error) {
      showToast(error.response?.data?.message || 'Reset failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">Set a new password</h2>
      <p className="text-sm text-ink-muted mb-6">Choose a strong password you haven&apos;t used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Reset Password
        </Button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
