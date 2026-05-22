import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { projectApi, userApi } from '../api/services';
import Button from '../components/Button';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import { apiErrorMessage } from '../utils/format';

const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'ACTIVE', members: [] });

  useEffect(() => {
    Promise.all([userApi.list(), editing ? projectApi.get(id) : Promise.resolve(null)])
      .then(([usersRes, projectRes]) => {
        setUsers(usersRes.data.users);
        if (projectRes) {
          const project = projectRes.data.project;
          setForm({
            title: project.title,
            description: project.description,
            status: project.status,
            members: project.members.map((member) => member._id)
          });
        }
      })
      .catch((error) => toast.error(apiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const toggleMember = (userId) => {
    setForm((current) => ({
      ...current,
      members: current.members.includes(userId) ? current.members.filter((id) => id !== userId) : [...current.members, userId]
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.description) return toast.error('Title and description are required');
    setSaving(true);
    try {
      const response = editing ? await projectApi.update(id, form) : await projectApi.create(form);
      toast.success(editing ? 'Project updated' : 'Project created');
      navigate(`/projects/${response.data.project._id}`);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title={editing ? 'Edit project' : 'Create project'} eyebrow="Admin" />
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="space-y-4 rounded-lg border border-line bg-white p-5">
          <FormField label="Title">
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Description">
            <textarea className="input min-h-36" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </FormField>
          <Button disabled={saving}>
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Project'}
          </Button>
        </section>
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="mb-4 font-bold text-ink">Members</h2>
          <div className="space-y-3">
            {users.map((user) => (
              <label key={user._id} className="flex cursor-pointer items-center justify-between rounded-md border border-line p-3">
                <span>
                  <span className="block text-sm font-bold text-ink">{user.name}</span>
                  <span className="text-xs text-muted">{user.email}</span>
                </span>
                <input type="checkbox" checked={form.members.includes(user._id)} onChange={() => toggleMember(user._id)} />
              </label>
            ))}
          </div>
        </section>
      </form>
    </>
  );
};

export default ProjectFormPage;
