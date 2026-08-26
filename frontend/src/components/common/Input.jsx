import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <input ref={ref} className={`input ${error ? 'border-red-400 focus:ring-red-200' : ''}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
