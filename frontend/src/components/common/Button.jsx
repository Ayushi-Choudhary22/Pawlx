const VARIANT_CLASSES = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn bg-transparent text-ink hover:bg-surface',
  danger: 'btn bg-red-500 text-white hover:bg-red-600',
};

const SIZE_CLASSES = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon = null,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export default Button;
