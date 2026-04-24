import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { MemberCard } from '../../components/members/MemberCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';

export const MemberTeamPage = () => {
  const { organization } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchMembers();
  }, []);

  if (loading) return <div className="pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-t1 tracking-tight">Your Team</h1>
        <p className="text-t2 text-sm mt-1">{organization?.name}</p>
      </div>

      {members.length === 0 ? (
        <EmptyState title="No members found" description="There are no other members in your organization." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      <div className="pt-8 text-center">
        <p className="text-xs text-t3 bg-surface-2 inline-block px-3 py-1.5 rounded-md border border-border">
          Contact your admin to update team members
        </p>
      </div>
    </div>
  );
};
