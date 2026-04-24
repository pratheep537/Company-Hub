import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const role = await login(email, password);
      if (role !== 'ADMIN') {
        toast.error('This portal is for admins only');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] animate-pulse-dot" style={{ zIndex: -1 }}></div>

      <div className="w-full max-w-[420px] bg-surface border border-border rounded-2xl p-9 shadow-2xl animate-slide-up relative z-10">
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-accent text-white font-mono text-xs uppercase tracking-wider font-bold rounded-md">
            Admin
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-accent rounded shadow-lg"></div>
            <h1 className="text-3xl font-sans font-semibold text-white tracking-tight">Company Hub</h1>
          </div>
          <p className="text-t2">Organization admin portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-t3 hover:text-t2 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" loading={loading} variant="primary" size="lg" className="mt-2">
            Sign in as Admin
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3 text-center text-sm text-t2">
          <p>
            Are you a team member? <Link to="/member/login" className="text-accent hover:text-accent-dim hover:underline transition-colors">Sign in here</Link>
          </p>
          <p>
            New organization? <Link to="/register" className="text-accent hover:text-accent-dim hover:underline transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
