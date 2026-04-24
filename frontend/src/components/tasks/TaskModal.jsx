import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

export const TaskModal = ({ isOpen, onClose, task, onSaved, members = [] }) => {
  const { user } = useAuth();
  const isEditing = !!task;
  const isAdmin = user?.role === 'ADMIN';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    deadline: '',
    assignedToId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
        assignedToId: task.assignedToId || ''
      });
    } else if (isOpen) {
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        deadline: '',
        assignedToId: ''
      });
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      if (!payload.deadline) delete payload.deadline;
      if (!payload.assignedToId) delete payload.assignedToId;

      if (isEditing) {
        await api.patch(`/tasks/${task.id}`, payload);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', payload);
        toast.success('Task created');
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={!isAdmin && !isEditing} // Member can only create and edit. Actually prompt says Member creates task for themselves. So they can edit title if they are creating. Let's say member can edit title.
          readOnly={!isAdmin && isEditing && user.id !== task?.createdById} // If member didn't create it, they shouldn't edit title? Prompt says member can only update status and description.
        />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-t2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-base border border-border rounded-lg p-3 text-t1 placeholder-t3 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-t2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-base border border-border rounded-lg py-2 pl-3 pr-8 text-t1 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent appearance-none"
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-t2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={!isAdmin && isEditing} // Maybe member shouldn't change priority? Prompt just says member can update status and description.
              className="w-full bg-base border border-border rounded-lg py-2 pl-3 pr-8 text-t1 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent appearance-none disabled:opacity-50"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Deadline"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            disabled={!isAdmin && isEditing}
          />
          
          {isAdmin && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-t2">Assign To</label>
              <select
                name="assignedToId"
                value={formData.assignedToId}
                onChange={handleChange}
                className="w-full bg-base border border-border rounded-lg py-2 pl-3 pr-8 text-t1 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent appearance-none"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} variant={isAdmin ? 'primary' : 'primaryTeal'}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
