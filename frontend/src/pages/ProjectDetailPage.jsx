import { Edit, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { projectApi } from '../api/services';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { data, loading } = useApi(() => projectApi.get(id), [id]);

  if (loading) return <Spinner />;
  const { project, tasks } = data;

  return (
    <>
      <PageHeader
        title={project.title}
        eyebrow="Project"
        actions={
          isAdmin && (
            <>
              <Link to={`/projects/${project._id}/edit`} className="btn-secondary">
                <Edit size={17} />
                Edit
              </Link>
              <Link to="/tasks/new" className="btn-primary">
                <Plus size={17} />
                Add Task
              </Link>
            </>
          )
        }
      >
        {project.description}
      </PageHeader>
      <div className="mb-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-lg border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">Status</h2>
            <Badge tone={project.status}>{project.status}</Badge>
          </div>
          <p className="mt-4 text-sm text-muted">Created by {project.createdBy?.name}</p>
        </section>
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="mb-4 font-bold text-ink">Project members</h2>
          <div className="space-y-3">
            {project.members.map((member) => (
              <div key={member._id} className="flex items-center gap-3">
                <Avatar user={member} size="sm" />
                <div>
                  <p className="text-sm font-bold text-ink">{member.name}</p>
                  <p className="text-xs text-muted">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <h2 className="mb-3 font-bold text-ink">Tasks</h2>
      {!tasks.length ? (
        <EmptyState title="No tasks in this project" message="Tasks created for this project will appear here." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectDetailPage;
