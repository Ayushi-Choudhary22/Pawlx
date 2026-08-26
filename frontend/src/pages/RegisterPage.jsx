import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ROLES } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const ROLE_OPTIONS = [
  { value: ROLES.PET_OWNER, label: 'Pet Owner' },
  { value: ROLES.VETERINARIAN, label: 'Veterinarian' },
  { value: ROLES.PET_SITTER, label: 'Pet Sitter' },
  { value: ROLES.GROOMER, label: 'Groomer' },
];

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: ROLES.PET_OWNER },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const selectedRole = watch('role');

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await registerUser(formData);
      showToast('Account created successfully!', 'success');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">Create your account</h2>
      <p className="text-sm text-ink-muted mb-6">Join PAWLX and give your pet the care they deserve.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
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
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <div>
          <label className="label">I am a</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center justify-center rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                  selectedRole === opt.value
                    ? 'border-primary bg-primary-light text-primary font-medium'
                    : 'border-border text-ink-muted hover:bg-surface'
                }`}
              >
                <input type="radio" value={opt.value} className="hidden" {...register('role')} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
