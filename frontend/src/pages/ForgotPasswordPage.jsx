import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';
import { authService } from '@/services/authService';
import { useToast } from '@/context/ToastContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async ({ email }) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <FiCheckCircle className="mx-auto text-secondary mb-3" size={36} />
        <h2 className="text-lg font-semibold text-ink mb-2">Check your inbox</h2>
        <p className="text-sm text-ink-muted mb-6">
          If an account exists with that email, we&apos;ve sent a link to reset your password.
        </p>
        <Link to="/login" className="text-sm text-primary font-medium hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">Forgot your password?</h2>
      <p className="text-sm text-ink-muted mb-6">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Remembered your password?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
