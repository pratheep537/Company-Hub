import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 size={sizes[size]} className="animate-spin text-accent" />
    </div>
  );
};
