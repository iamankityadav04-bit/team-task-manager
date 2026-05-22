import { Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { projectApi, taskApi, userApi } from '../api/services';
import Button from '../components/Button';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import { apiErrorMessage } from '../utils/format';

const emptyForm = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '',
  assignedTo: '',
  project: ''
};

const TaskFormPage = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([projectApi.list(), userApi.list(), editing ? taskApi.get(id) : Promise.resolve(null)])
      .then(([projectRes, userRes, taskRes]) => {
        setProjects(projectRes.data.projects);
        setUsers(userRes.data.users);
        if (taskRes) {
          const task = taskRes.data.task;
          setForm({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate?.slice(0, 10),
            assignedTo: task.assignedTo?._id,
            project: task.project?._id
          });
        }
      })
      .catch((error) => toast.error(apiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const selectedProject = useMemo(() => projects.find((project) => project._id === form.project), [projects, form.project]);
  const memberIds = selectedProject?.members?.map((member) => member._id || member) || [];
  const assignableUsers = selectedProject ? users.filter((user) => memberIds.includes(user._id)) : users;

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.description || !form.dueDate || !form.assignedTo || !form.project) {
      return toast.error('All task fields are required');
    }

    setSaving(true);
    try {
      const response = editing ? await taskApi.update(id, form) : await taskApi.create(form);
      toast.success(editing ? 'Task updated' : 'Task created');
      navigate(`/tasks/${response.data.task._id}`);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title={editing ? 'Edit task' : 'Create task'} eyebrow="Admin" />
      <form onSubmit={submit} className="space-y-5 rounded-lg border border-line bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Title">
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Project">
            <select className="input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value, assignedTo: '' })}>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Assigned to">
            <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
              <option value="">Select member</option>
              {assignableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Due date">
            <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </FormField>
          <FormField label="Priority">
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </FormField>
        </div>
        <FormField label="Description">
          <textarea className="input min-h-36" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </FormField>
        <Button disabled={saving}>
          <Save size={17} />
          {saving ? 'Saving...' : 'Save Task'}
        </Button>
      </form>
    </>
  );
};

export default TaskFormPage;
