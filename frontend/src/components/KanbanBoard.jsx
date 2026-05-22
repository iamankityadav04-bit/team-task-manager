import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { taskApi } from '../api/services';
import TaskCard from './TaskCard';

const columns = [
  { id: 'TODO', title: 'To do' },
  { id: 'IN_PROGRESS', title: 'In progress' },
  { id: 'COMPLETED', title: 'Completed' }
];

const KanbanBoard = ({ tasks, setTasks }) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.data.current.status === over.id) return;

    const previousStatus = active.data.current.status;
    const nextStatus = over.id;
    setTasks((items) => items.map((task) => (task._id === active.id ? { ...task, status: nextStatus } : task)));

    try {
      const { data } = await taskApi.status(active.id, nextStatus);
      setTasks((items) => items.map((task) => (task._id === active.id ? data.task : task)));
      toast.success('Task moved');
    } catch (error) {
      setTasks((items) => items.map((task) => (task._id === active.id ? { ...task, status: previousStatus } : task)));
      toast.error(error.response?.data?.message || 'Could not move task');
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative z-0 grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <DroppableColumn key={column.id} id={column.id} title={column.title} tasks={tasks.filter((task) => task.status === column.id)} />
        ))}
      </div>
    </DndContext>
  );
};

const DroppableColumn = ({ id, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[420px] rounded-xl border border-line p-3 shadow-sm transition-colors ${
        isOver ? 'bg-blue-50 ring-2 ring-brand/20' : 'bg-slate-100/70'
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="font-bold text-ink">{title}</h2>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-muted">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <DraggableTask key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

const DraggableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: { status: task.status }
  });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return <TaskCard task={task} innerRef={setNodeRef} style={style} draggableProps={attributes} dragHandleProps={listeners} />;
};

export default KanbanBoard;
