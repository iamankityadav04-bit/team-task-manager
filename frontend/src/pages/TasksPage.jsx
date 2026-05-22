import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { projectApi, taskApi } from '../api/services';
import EmptyState from '../components/EmptyState';
import KanbanBoard from '../components/KanbanBoard';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', project: '' });

  useEffect(() => {
    setLoading(true);
    Promise.all([taskApi.list(), projectApi.list()])
      .then(([tasksRes, projectsRes]) => {
        setTasks(tasksRes.data.tasks);
        setProjects(projectsRes.data.projects);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        [task.title, task.description, task.assignedTo?.name, task.assignedTo?.email]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search));

      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesProject = !filters.project || task.project?._id === filters.project;

      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }, [tasks, filters]);

  return (
    <>
      <PageHeader title="Task board" eyebrow="Kanban">
        Drag tasks between columns to update status. Members can move only tasks assigned to them.
      </PageHeader>
      <section className="relative z-10 mb-5 grid gap-3 rounded-lg border border-line bg-white p-4 shadow-sm lg:grid-cols-[minmax(220px,1fr)_180px_180px_220px]">
        <label className="flex min-h-10 cursor-text items-center gap-2 rounded-md border border-line bg-slate-50 px-3 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/15">
          <Search size={16} className="text-muted" />
          <input
            className="w-full bg-transparent py-2 text-sm outline-none"
            placeholder="Search title, description, assignee"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </label>
        <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <select className="input" value={filters.project} onChange={(e) => setFilters({ ...filters, project: e.target.value })}>
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </section>
      {loading ? (
        <Spinner />
      ) : filteredTasks.length ? (
        <KanbanBoard tasks={filteredTasks} setTasks={setTasks} />
      ) : (
        <EmptyState title="No matching tasks" message="Adjust the filters or create a new task for your team." />
      )}
    </>
  );
};

export default TasksPage;
