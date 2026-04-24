import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent text-t1 hover:bg-accent-dim focus:ring-accent',
    primaryTeal: 'bg-teal text-t1 hover:bg-teal-dim focus:ring-teal', // For member portal
    danger: 'bg-danger text-t1 hover:opacity-90 focus:ring-danger',
    ghost: 'bg-transparent text-t2 hover:bg-surface-2 hover:text-t1 focus:ring-border',
    outline: 'bg-transparent border border-border text-t1 hover:bg-surface-2 focus:ring-border',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base w-full',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
