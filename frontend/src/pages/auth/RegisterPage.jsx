import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Building2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgName: '',
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePasswordStrength = (pwd) => {
    if (pwd.length === 0) return 0;
    if (pwd.length < 6) return 1;
    if (pwd.length >= 6 && pwd.length <= 10 && !/[^a-zA-Z0-9]/.test(pwd) && !/[0-9]/.test(pwd)) return 2;
    if (pwd.length > 10 || (pwd.length >= 6 && (/[^a-zA-Z0-9]/.test(pwd) || /[0-9]/.test(pwd)))) return 3;
    return 2;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.orgName, formData.name, formData.email, formData.password);
      toast.success(`Welcome, ${formData.name}! Your organization is ready.`);
      navigate('/admin/dashboard');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] animate-pulse-dot" style={{ zIndex: -1 }}></div>

      <div className="w-full max-w-[460px] bg-surface border border-border rounded-2xl p-9 shadow-2xl animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-accent rounded shadow-lg"></div>
            <h1 className="text-3xl font-sans font-semibold text-white tracking-tight">Company Hub</h1>
          </div>
          <h2 className="text-xl font-medium text-t1 mt-4">Create your organization</h2>
          <p className="text-t2 text-sm mt-1">You'll become the admin automatically</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            icon={Building2}
            name="orgName"
            placeholder="Organization Name"
            value={formData.orgName}
            onChange={handleChange}
            required
          />
          
          <Input
            icon={User}
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <div className="space-y-2">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.password.length > 0 && (
              <div className="flex gap-1 h-1.5 mt-2">
                <div className={`flex-1 rounded-full ${strength >= 1 ? (strength === 1 ? 'bg-danger' : strength === 2 ? 'bg-warning' : 'bg-success') : 'bg-surface-2'}`}></div>
                <div className={`flex-1 rounded-full ${strength >= 2 ? (strength === 2 ? 'bg-warning' : 'bg-success') : 'bg-surface-2'}`}></div>
                <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-success' : 'bg-surface-2'}`}></div>
              </div>
            )}
            {formData.password.length > 0 && strength === 1 && <p className="text-xs text-danger">Weak password</p>}
            {formData.password.length > 0 && strength === 2 && <p className="text-xs text-warning">Medium password</p>}
            {formData.password.length > 0 && strength === 3 && <p className="text-xs text-success">Strong password</p>}
          </div>

          <Button type="submit" loading={loading} variant="primary" size="lg" className="mt-4">
            Create Organization
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-t2">
          <p>
            Already have an account? <Link to="/admin/login" className="text-accent hover:text-accent-dim hover:underline transition-colors">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
