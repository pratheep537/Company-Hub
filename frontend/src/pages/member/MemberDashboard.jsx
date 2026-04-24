import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { CheckSquare, CircleDashed, CheckCircle2, Plus } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskModal } from '../../components/tasks/TaskModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      // Filter for tasks created by me or assigned to me
      const myTasks = (data.tasks || []).filter(t => t.createdById === user.id || t.assignedToId === user.id);
      setTasks(myTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'My Tasks', value: tasks.length, icon: CheckSquare, colorClass: 'text-teal' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: CircleDashed, colorClass: 'text-teal' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'DONE').length, icon: CheckCircle2, colorClass: 'text-success' },
  ];

  if (loading) return <div className="pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      <div>
        <h1 className="text-3xl font-bold text-t1 tracking-tight mb-2">
          {greeting()}, {(user?.name || 'User').split(' ')[0]}
        </h1>
        <p className="text-t2">{format(new Date(), 'EEEE, MMMM d')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-t1">My Tasks</h2>
        
        {tasks.length === 0 ? (
          <EmptyState 
            title="You're all caught up!" 
            description="You don't have any tasks assigned to you right now. Enjoy your day!"
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                showDelete={false}
                onClick={(t) => { setSelectedTask(t); setIsTaskModalOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-teal text-white rounded-full flex items-center justify-center shadow-lg shadow-teal/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal/30 transition-all z-40"
      >
        <Plus size={24} />
      </button>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSaved={fetchTasks}
        task={selectedTask}
      />
    </div>
  );
};
