import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { CheckSquare, CircleDashed, CheckCircle2, Users, Plus } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/tasks/StatusBadge';
import { TaskModal } from '../../components/tasks/TaskModal';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export const AdminDashboard = () => {
  const { user, organization } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, membersRes, logsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/org/members'),
        api.get('/logs')
      ]);
      setTasks(tasksRes.data.tasks || []);
      setMembers(membersRes.data.members || []);
      setLogs(logsRes.data.logs || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, colorClass: 'text-t1' },
    { label: 'Todo', value: tasks.filter(t => t.status === 'TODO').length, icon: CircleDashed, colorClass: 'text-t2' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: CircleDashed, colorClass: 'text-accent' },
    { label: 'Done', value: tasks.filter(t => t.status === 'DONE').length, icon: CheckCircle2, colorClass: 'text-success' },
    { label: 'Team Members', value: members.length, icon: Users, colorClass: 'text-t1' },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-t1 tracking-tight mb-2">
            {greeting()}, {(user?.name || 'User').split(' ')[0]}
          </h1>
          <p className="text-t2">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <div className="bg-surface-2 border border-border px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-t1">{organization?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="space-y-8">
        {/* Recent Tasks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-t1">Recent Tasks</h2>
            <Link to="/admin/tasks" className="text-sm text-accent hover:text-accent-dim transition-colors">View all</Link>
          </div>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-t2">No tasks yet</div>
            ) : (
              <div className="divide-y divide-border">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.id} className="p-4 hover:bg-surface-2 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${task.priority === 'HIGH' ? 'bg-danger' : task.priority === 'MEDIUM' ? 'bg-warning' : 'bg-success'}`}></div>
                      <div>
                        <h3 className="text-sm font-medium text-t1 group-hover:text-accent transition-colors">{task.title}</h3>
                        <p className="text-xs text-t2 mt-1">{task.deadline ? format(new Date(task.deadline), 'MMM d') : 'No deadline'}</p>
                      </div>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <button 
        onClick={() => setIsTaskModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/30 transition-all z-40"
      >
        <Plus size={24} />
      </button>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSaved={fetchDashboardData}
        members={members}
      />
    </div>
  );
};
