import { ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../utils/format';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'password123' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) return toast.error('Email and password are required');
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-brand text-white">
          <ClipboardCheck size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-ink">Sign in</h1>
          <p className="text-sm text-muted">Use the seeded admin account to explore fast.</p>
        </div>
      </div>
      <div className="space-y-4">
        <FormField label="Email">
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Password">
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>
      </div>
      <Button className="mt-6 w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Login'}
      </Button>
      <p className="mt-5 text-center text-sm text-muted">
        New here?{' '}
        <Link className="font-bold text-brand" to="/register">
          Create an account
        </Link>
      </p>
    </form>
  );
};

export default LoginPage;
