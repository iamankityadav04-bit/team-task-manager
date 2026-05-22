import { Edit, MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { taskApi } from '../api/services';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { apiErrorMessage, formatDate, isOverdue } from '../utils/format';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data, loading, setData } = useApi(() => taskApi.get(id), [id]);
  const [comment, setComment] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const changeStatus = async (status) => {
    try {
      const response = await taskApi.status(id, status);
      setData({ success: true, task: response.data.task });
      toast.success('Status updated');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const addComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    try {
      const response = await taskApi.comment(id, comment);
      setData({ success: true, task: response.data.task });
      setComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const remove = async () => {
    try {
      await taskApi.remove(id);
      toast.success('Task deleted');
      navigate('/tasks');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  if (loading) return <Spinner />;
  const task = data.task;

  return (
    <>
      <PageHeader
        title={task.title}
        eyebrow={task.project?.title}
        actions={
          isAdmin && (
            <>
              <Link to={`/tasks/${task._id}/edit`} className="btn-secondary">
                <Edit size={17} />
                Edit
              </Link>
              <Button variant="secondary" className="text-rose-600" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={17} />
                Delete
              </Button>
            </>
          )
        }
      >
        {task.description}
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="mb-4 font-bold text-ink">Task details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Status" value={<Badge tone={task.status}>{task.status}</Badge>} />
            <Info label="Priority" value={<Badge tone={task.priority}>{task.priority}</Badge>} />
            <Info label="Due date" value={<span className={isOverdue(task) ? 'text-rose-600' : ''}>{formatDate(task.dueDate)}</span>} />
            <Info label="Created by" value={task.createdBy?.name} />
          </div>
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-bold text-ink">Update status</h3>
            <div className="flex flex-wrap gap-2">
              {['TODO', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                <Button key={status} variant={task.status === status ? 'primary' : 'secondary'} onClick={() => changeStatus(status)}>
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </section>
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="mb-4 font-bold text-ink">Assignee</h2>
          <div className="flex items-center gap-3">
            <Avatar user={task.assignedTo} size="lg" />
            <div>
              <p className="font-bold text-ink">{task.assignedTo?.name}</p>
              <p className="text-sm text-muted">{task.assignedTo?.email}</p>
            </div>
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-lg border border-line bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-brand" />
          <h2 className="font-bold text-ink">Comments</h2>
        </div>
        <form onSubmit={addComment} className="mb-5 flex gap-2">
          <input className="input" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" />
          <Button>Add</Button>
        </form>
        <div className="space-y-3">
          {task.comments?.length ? (
            task.comments.map((item) => (
              <div key={item._id || item.createdAt} className="rounded-md bg-slate-50 p-3">
                <p className="text-sm text-ink">{item.body}</p>
                <p className="mt-1 text-xs font-semibold text-muted">{item.user?.name}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No comments yet.</p>
          )}
        </div>
      </section>
      <Modal
        open={confirmDelete}
        title="Delete task"
        onClose={() => setConfirmDelete(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button onClick={remove}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-muted">This task will be permanently removed.</p>
      </Modal>
    </>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
    <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
  </div>
);

export default TaskDetailPage;
