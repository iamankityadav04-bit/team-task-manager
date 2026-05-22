import { ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../utils/format';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'MEMBER' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields are required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error('Enter a valid email');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate('/dashboard', { replace: true });
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
          <h1 className="text-2xl font-bold text-ink">Create account</h1>
          <p className="text-sm text-muted">Start as a member or admin for demo workspaces.</p>
        </div>
      </div>
      <div className="space-y-4">
        <FormField label="Name">
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Email">
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Role">
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </FormField>
        <FormField label="Password">
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>
        <FormField label="Confirm password">
          <input
            className="input"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        </FormField>
      </div>
      <Button className="mt-6 w-full" disabled={loading}>
        {loading ? 'Creating...' : 'Register'}
      </Button>
      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link className="font-bold text-brand" to="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
