import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskModal } from '../../components/tasks/TaskModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { Plus, Search, FilterX } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const MemberTasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      // Filter for my tasks
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  const hasActiveFilters = search || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  if (loading) return <div className="pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-t1 tracking-tight">My Tasks</h1>
        <Button onClick={() => { setSelectedTask(null); setIsModalOpen(true); }} variant="primaryTeal">
          <Plus size={18} className="mr-2" /> Add Task
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-base border border-border rounded-lg py-2 pl-9 pr-3 text-sm text-t1 focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-base border border-border rounded-lg py-2 px-3 text-sm text-t1 focus:outline-none focus:ring-1 focus:ring-teal"
        >
          <option value="ALL">All Status</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-base border border-border rounded-lg py-2 px-3 text-sm text-t1 focus:outline-none focus:ring-1 focus:ring-teal"
        >
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-t2 hover:text-t1 flex items-center gap-1 p-2">
            <FilterX size={16} /> Clear
          </button>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={hasActiveFilters ? "Try adjusting your filters to find what you're looking for." : "You have no tasks. Add one to get started!"}
          action={!hasActiveFilters ? <Button onClick={() => { setSelectedTask(null); setIsModalOpen(true); }} variant="primaryTeal">Add Task</Button> : null}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              showDelete={false}
              onClick={(t) => { setSelectedTask(t); setIsModalOpen(true); }}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onSaved={fetchTasks}
      />
    </div>
  );
};
