export const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="block text-sm font-medium text-t2">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-t3">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`w-full bg-base border ${error ? 'border-danger' : 'border-border'} rounded-lg py-2 ${Icon ? 'pl-10' : 'pl-3'} pr-3 text-t1 placeholder-t3 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};
