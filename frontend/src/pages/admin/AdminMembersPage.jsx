import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { MemberCard } from '../../components/members/MemberCard';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AdminMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER'
  });
  const [inviteLoading, setInviteLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/org/members');
      setMembers(data.members || []);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      await api.post('/org/invite', inviteData);
      toast.success('Member invited successfully');
      setIsInviteModalOpen(false);
      setInviteData({ name: '', email: '', password: '', role: 'MEMBER' });
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to invite member');
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) return <div className="pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-t1 tracking-tight">Team Members</h1>
          <p className="text-t2 text-sm mt-1">{members.length} members in your organization</p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          <UserPlus size={18} className="mr-2" /> Invite Member
        </Button>
      </div>

      {members.length === 0 ? (
        <EmptyState title="No members yet" description="Start building your team by inviting people." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={inviteData.name}
            onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={inviteData.email}
            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
            required
          />
          <Input
            label="Temporary Password"
            type="password"
            name="password"
            value={inviteData.password}
            onChange={(e) => setInviteData({ ...inviteData, password: e.target.value })}
            required
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-t2">Role</label>
            <select
              name="role"
              value={inviteData.role}
              onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
              className="w-full bg-base border border-border rounded-lg py-2 pl-3 pr-8 text-t1 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent appearance-none"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={inviteLoading}>Send Invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
