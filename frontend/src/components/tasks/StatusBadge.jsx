import { Check } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  if (status === 'TODO') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-2 text-t2 border border-border">
        Todo
      </span>
    );
  }

  if (status === 'IN_PROGRESS') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        In Progress
      </span>
    );
  }

  if (status === 'DONE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
        <Check size={12} />
        Done
      </span>
    );
  }

  return null;
};
