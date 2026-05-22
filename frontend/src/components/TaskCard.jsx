import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Badge from './Badge';
import { formatDate, isOverdue } from '../utils/format';

const TaskCard = ({ task, draggableProps = {}, dragHandleProps = {}, innerRef, style }) => (
  <article
    ref={innerRef}
    style={style}
    className="rounded-xl border border-line bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-soft"
    {...draggableProps}
    {...dragHandleProps}
  >
    <div className="flex items-start justify-between gap-3">
      <Link to={`/tasks/${task._id}`} className="font-bold text-ink hover:text-brand">
        {task.title}
      </Link>
      <Badge tone={task.priority}>{task.priority}</Badge>
    </div>
    <p className="mt-2 line-clamp-2 text-sm text-muted">{task.description}</p>
    <div className="mt-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Avatar user={task.assignedTo} size="sm" />
        <span className="text-xs font-semibold text-muted">{task.assignedTo?.name}</span>
      </div>
      <span className={`inline-flex items-center gap-1 text-xs font-bold ${isOverdue(task) ? 'text-rose-600' : 'text-muted'}`}>
        <CalendarDays size={14} />
        {formatDate(task.dueDate)}
      </span>
    </div>
  </article>
);

export default TaskCard;
