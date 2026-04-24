export const StatCard = ({ label, value, icon: Icon, colorClass, trend }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:-translate-y-0.5 hover:border-t3 transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-t2 font-medium">{label}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
            <Icon size={18} className={colorClass} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-t1">{value}</h3>
        {trend && <span className="text-xs text-success font-medium">{trend}</span>}
      </div>
    </div>
  );
};
