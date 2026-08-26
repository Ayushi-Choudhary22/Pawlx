import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await login(formData);
      showToast('Welcome back!', 'success');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">Welcome back</h2>
      <p className="text-sm text-ink-muted mb-6">Log in to manage your pets and bookings.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Log In
        </Button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
