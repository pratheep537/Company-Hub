import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export const AdminPanelPage = () => {
  const { organization } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState(organization?.name || '');
  const [savingOrg, setSavingOrg] = useState(false);

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

  const handleUpdateOrg = async (e) => {
    e.preventDefault();
    setSavingOrg(true);
    try {
      // Assuming a PATCH endpoint exists for org name
      await api.patch('/org', { name: orgName });
      toast.success('Organization updated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update organization');
    } finally {
      setSavingOrg(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      // Assuming role change endpoint
      await api.patch(`/org/members/${memberId}/role`, { role: newRole });
      toast.success('Role updated');
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update role. Contact backend to update roles.');
      // Revert select visually if failed by refetching or relying on react state (we just refetch in success, so it naturally reverts if failed because state isn't updated)
      fetchMembers();
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/org/members/${memberId}`);
      toast.success('Member removed');
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Not yet supported by backend');
    }
  };

  if (loading) return <div className="pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-t1 tracking-tight">Admin Panel</h1>
        <p className="text-t2 text-sm mt-1">Manage your organization settings and access</p>
      </div>

      {/* Section 1: Org Info */}
      <section className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-t1 mb-4">Organization Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-t2 mb-1">Organization ID</p>
              <div className="bg-surface-2 border border-border rounded-lg p-3">
                <code className="text-sm text-t1 font-mono">{organization?.id}</code>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-t2 mb-1">Created At</p>
              <p className="text-t1">{organization?.createdAt ? format(new Date(organization.createdAt), 'MMMM d, yyyy') : 'Unknown'}</p>
            </div>
          </div>
          
          <form onSubmit={handleUpdateOrg} className="space-y-4">
            <Input
              label="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
            <Button type="submit" loading={savingOrg}>Save Changes</Button>
          </form>
        </div>
      </section>

      {/* Section 2: Role Management */}
      <section className="bg-surface border border-border rounded-xl p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-t1 mb-4">Role Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-sm font-medium text-t2 font-sans">Name</th>
                <th className="pb-3 text-sm font-medium text-t2 font-sans">Email</th>
                <th className="pb-3 text-sm font-medium text-t2 font-sans">Current Role</th>
                <th className="pb-3 text-sm font-medium text-t2 font-sans text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="py-4 text-sm font-medium text-t1">{member.name}</td>
                  <td className="py-4 text-sm text-t2">{member.email}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${member.role === 'ADMIN' ? 'bg-accent/10 text-accent' : 'bg-teal/10 text-teal'}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="bg-base border border-border rounded-lg py-1.5 pl-3 pr-8 text-sm text-t1 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent appearance-none ml-auto block"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Danger Zone */}
      <section className="bg-surface border border-danger/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-danger"></div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-danger" size={20} />
          <h2 className="text-lg font-bold text-danger">Danger Zone</h2>
        </div>
        <p className="text-t2 text-sm mb-6">This section contains irreversible actions. Please proceed with caution.</p>
        
        <div className="border border-border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-t1">Remove Member</h3>
            <p className="text-xs text-t2 mt-1">Permanently remove a user from your organization.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select id="remove-member-select" className="flex-1 md:w-48 bg-base border border-border rounded-lg py-2 px-3 text-sm text-t1 focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger">
              <option value="">Select member...</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
              ))}
            </select>
            <Button 
              variant="danger" 
              onClick={() => {
                const select = document.getElementById('remove-member-select');
                if (select.value) handleRemoveMember(select.value);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
