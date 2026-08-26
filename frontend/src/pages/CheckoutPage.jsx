import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { orderService } from '@/services/marketplaceService';
import { useToast } from '@/context/ToastContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'upi', label: 'UPI' },
];

const CheckoutPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { paymentMethod: 'cod' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { paymentMethod, ...shippingAddress } = formData;
      const res = await orderService.placeOrder({ shippingAddress, paymentMethod });
      showToast('Order placed successfully!', 'success');
      navigate(`/orders/${res.data._id}`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div>
          <h3 className="font-semibold text-ink mb-3">Shipping Address</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              label="Street address"
              className="sm:col-span-2"
              error={errors.street?.message}
              {...register('street', { required: 'Required' })}
            />
            <Input label="City" error={errors.city?.message} {...register('city', { required: 'Required' })} />
            <Input label="State" error={errors.state?.message} {...register('state', { required: 'Required' })} />
            <Input label="Zip Code" {...register('zipCode')} />
            <Input label="Phone" {...register('phone')} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-ink mb-3">Payment Method</h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 cursor-pointer text-sm"
              >
                <input type="radio" value={method.value} {...register('paymentMethod')} />
                {method.label}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Place Order
        </Button>
      </form>
    </div>
  );
};

export default CheckoutPage;
