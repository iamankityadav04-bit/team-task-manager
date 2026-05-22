import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { projectApi } from '../api/services';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data, loading, refetch } = useApi(() => projectApi.list());
  const [deleteId, setDeleteId] = useState(null);

  const removeProject = async () => {
    try {
      await projectApi.remove(deleteId);
      toast.success('Project deleted');
      setDeleteId(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete project');
    }
  };

  if (loading) return <Spinner />;
  const projects = data?.projects || [];

  return (
    <>
      <PageHeader
        title="Projects"
        eyebrow="Workspace"
        actions={
          isAdmin && (
            <Button onClick={() => navigate('/projects/new')}>
              <Plus size={17} />
              New Project
            </Button>
          )
        }
      >
        Admins can create projects and manage membership. Members see only projects assigned to them.
      </PageHeader>

      {!projects.length ? (
        <EmptyState title="No projects yet" message="Create a project to start organizing work by team and delivery goal." actionLabel={isAdmin ? 'Create Project' : null} onAction={() => navigate('/projects/new')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project._id} className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to={`/projects/${project._id}`} className="text-lg font-bold text-ink hover:text-brand">
                    {project.title}
                  </Link>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{project.description}</p>
                </div>
                <Badge tone={project.status}>{project.status}</Badge>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 4).map((member) => (
                    <Avatar key={member._id} user={member} size="sm" />
                  ))}
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button variant="secondary" className="h-9 w-9 p-0" onClick={() => navigate(`/projects/${project._id}/edit`)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="secondary" className="h-9 w-9 p-0 text-rose-600" onClick={() => setDeleteId(project._id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(deleteId)}
        title="Delete project"
        onClose={() => setDeleteId(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button onClick={removeProject}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-muted">This will delete the project and all related tasks.</p>
      </Modal>
    </>
  );
};

export default ProjectsPage;
