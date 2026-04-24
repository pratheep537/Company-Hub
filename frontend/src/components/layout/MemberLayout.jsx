import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CheckSquare, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export const MemberLayout = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/member/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/member/tasks', icon: CheckSquare, label: 'My Tasks' },
    { to: '/member/team', icon: Users, label: 'Team' },
  ];

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-surface border-r border-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-teal rounded-sm"></div>
              <span className="font-bold text-lg tracking-tight text-t1 whitespace-nowrap">Company Hub</span>
            </div>
          )}
          {isCollapsed && <div className="w-6 h-6 bg-teal rounded-sm mx-auto"></div>}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-t2 hover:text-t1 p-1 rounded-md hover:bg-surface-2 hidden md:block"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-teal/10 text-teal font-medium' 
                    : 'text-t2 hover:bg-surface-2 hover:text-t1'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={20} className={isCollapsed ? 'mx-auto' : ''} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-t1 truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.5 bg-teal/20 text-teal rounded text-[10px] font-bold uppercase tracking-wider">
                    Member
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`flex items-center text-t2 hover:text-danger hover:bg-danger/10 px-3 py-2.5 rounded-lg transition-colors w-full ${isCollapsed ? 'justify-center' : 'gap-3'}`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
