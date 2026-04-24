import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LogDetails = ({ oldValue, newValue }) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="bg-danger/5 border border-danger/20 rounded-md p-3 overflow-x-auto">
        <div className="text-danger font-bold mb-2 uppercase tracking-wider text-[10px]">Before</div>
        <pre className="text-t2 whitespace-pre-wrap break-words">{oldValue ? JSON.stringify(oldValue, null, 2) : 'null'}</pre>
      </div>
      <div className="bg-success/5 border border-success/20 rounded-md p-3 overflow-x-auto">
        <div className="text-success font-bold mb-2 uppercase tracking-wider text-[10px]">After</div>
        <pre className="text-t1 whitespace-pre-wrap break-words">{newValue ? JSON.stringify(newValue, null, 2) : 'null'}</pre>
      </div>
    </div>
  );
};

export const AdminAuditLogsPage = () => {
  const { organization } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedLogId, setExpandedLogId] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/logs');
        setLogs(data.logs || []);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATED': return 'bg-success text-success';
      case 'UPDATED': return 'bg-accent text-accent';
      case 'STATUS_CHANGED': return 'bg-warning text-warning';
      case 'DELETED': return 'bg-danger text-danger';
      default: return 'bg-t2 text-t2';
    }
  };

  const getActionPillColor = (action) => {
    switch (action) {
      case 'CREATED': return 'bg-success/10 text-success border-success/20';
      case 'UPDATED': return 'bg-accent/10 text-accent border-accent/20';
      case 'STATUS_CHANGED': return 'bg-warning/10 text-warning border-warning/20';
      case 'DELETED': return 'bg-danger/10 text-danger border-danger/20';
      default: return 'bg-t2/10 text-t2 border-border';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const searchLower = search.toLowerCase();
    const taskTitle = log.task?.title || log.newValue?.title || log.oldValue?.title || '';
    const userName = log.performedBy?.name || '';
    const matchesSearch = taskTitle.toLowerCase().includes(searchLower) || userName.toLowerCase().includes(searchLower);
    return matchesAction && matchesSearch;
  });

  if (loading) return <div className="pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-t1 tracking-tight">Audit Logs</h1>
        <p className="text-t2 text-sm mt-1">Complete activity trail for {organization?.name}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3" />
          <input
            type="text"
            placeholder="Search by task title or user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg py-2 pl-9 pr-3 text-sm text-t1 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="bg-surface border border-border rounded-lg py-2 px-3 text-sm text-t1 focus:outline-none focus:ring-1 focus:ring-accent w-full sm:w-48"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATED">Created</option>
          <option value="UPDATED">Updated</option>
          <option value="STATUS_CHANGED">Status Changed</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState 
          title="No activity recorded" 
          description={logs.length === 0 ? "No activity recorded yet for this organization." : "No logs match your current filters."}
        />
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-[27px] w-px bg-border z-0"></div>
          
          <div className="divide-y divide-border relative z-10">
            {filteredLogs.map(log => {
              const isExpanded = expandedLogId === log.id;
              
              return (
                <div key={log.id} className="p-4 hover:bg-surface-2/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="pt-1.5 z-10 bg-surface">
                      <div className={`w-3 h-3 rounded-full ${getActionColor(log.action)} ring-4 ring-surface`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border uppercase ${getActionPillColor(log.action)}`}>
                            {log.action.replace('_', ' ')}
                          </span>
                          <p className="text-sm text-t1">
                            <span className="font-medium text-white">{log.performedBy?.name || 'Unknown User'}</span>
                            <span className="text-t2 mx-1">{log.action.toLowerCase().replace('_', ' ')} task</span>
                            <span className="font-medium text-white">{log.task?.title || log.newValue?.title || log.oldValue?.title || 'Unknown Task'}</span>
                          </p>
                        </div>
                        <span className="text-xs text-t3 shrink-0 whitespace-nowrap">
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-3 animate-fade-in">
                          <LogDetails oldValue={log.oldValue} newValue={log.newValue} />
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="p-1.5 text-t3 hover:text-t1 rounded-md hover:bg-border transition-colors mt-0.5"
                      title={isExpanded ? "Collapse details" : "Expand details"}
                    >
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
