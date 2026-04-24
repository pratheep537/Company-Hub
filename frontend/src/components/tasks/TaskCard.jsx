import { format, isPast } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const TaskCard = ({ task, onClick, onDelete, showDelete = true }) => {
  const priorityColors = {
    HIGH: 'border-l-danger',
    MEDIUM: 'border-l-warning',
    LOW: 'border-l-success',
  };

  const isOverdue = task.deadline && isPast(new Date(task.deadline)) && task.status !== 'DONE';

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getAvatarColor = (name) => {
    if (!name) return 'bg-surface-2';
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div 
      className={`group relative bg-surface border border-border border-l-4 rounded-xl p-4 hover:border-t3 hover:shadow-md transition-all cursor-pointer ${priorityColors[task.priority]}`}
      onClick={() => onClick(task)}
    >
      <div className="pr-12">
        <h3 className="text-[15px] font-bold text-t1 mb-1 truncate">{task.title}</h3>
        <p className="text-sm text-t2 truncate mb-4">{task.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <StatusBadge status={task.status} />
          <span className="text-xs font-medium text-t3 uppercase tracking-wider">{task.priority}</span>
          {task.deadline && (
            <span className={`text-xs font-medium ${isOverdue ? 'text-danger' : 'text-t3'}`}>
              {isOverdue ? 'Overdue' : format(new Date(task.deadline), 'MMM d')}
            </span>
          )}
        </div>

        {task.assignedTo && (
          <div className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white shadow-sm" title={task.assignedTo.name} style={{ backgroundColor: 'var(--surface-2)' }}>
            <div className={`w-full h-full rounded-full flex items-center justify-center ${getAvatarColor(task.assignedTo.name)}`}>
               {getInitials(task.assignedTo.name)}
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button className="p-1.5 bg-surface-2 text-t2 hover:text-t1 rounded-md hover:bg-border transition-colors">
          <Edit2 size={14} />
        </button>
        {showDelete && (
          <button 
            className="p-1.5 bg-surface-2 text-danger hover:bg-danger/20 rounded-md transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id);
              }
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
