import { format } from 'date-fns';

export const MemberCard = ({ member, onRoleChange }) => {
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
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200">
      <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center text-xl font-bold text-white shadow-sm ${getAvatarColor(member.name)}`}>
        {getInitials(member.name)}
      </div>
      
      <h3 className="text-base font-bold text-t1 mb-0.5">{member.name}</h3>
      <p className="text-sm text-t2 mb-3">{member.email}</p>
      
      <div className="mb-4">
        {member.role === 'ADMIN' ? (
          <span className="px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Admin
          </span>
        ) : (
          <span className="px-2.5 py-1 bg-teal/10 text-teal border border-teal/20 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Member
          </span>
        )}
      </div>
      
      <div className="text-xs text-t3 mt-auto w-full pt-4 border-t border-border flex justify-between items-center">
        <span>Joined {member.createdAt ? format(new Date(member.createdAt), 'MMM yyyy') : 'Unknown'}</span>
        
        {onRoleChange && (
          <select 
            value={member.role}
            onChange={(e) => onRoleChange(member.id, e.target.value)}
            className="bg-surface-2 border border-border rounded px-2 py-1 text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          >
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
          </select>
        )}
      </div>
    </div>
  );
};
