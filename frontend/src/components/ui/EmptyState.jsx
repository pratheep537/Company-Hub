import { Inbox } from 'lucide-react';

export const EmptyState = ({ title, description, action, icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-surface-2/50">
      <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center mb-4 border border-border">
        <Icon size={24} className="text-t3" />
      </div>
      <h3 className="text-lg font-medium text-t1 mb-1">{title}</h3>
      <p className="text-sm text-t2 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
};
