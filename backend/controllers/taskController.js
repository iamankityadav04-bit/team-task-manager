import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildTaskQuery } from '../utils/query.js';

const taskPopulate = [
  { path: 'assignedTo', select: 'name email avatar role' },
  { path: 'createdBy', select: 'name email avatar role' },
  { path: 'project', select: 'title status members' },
  { path: 'comments.user', select: 'name email avatar' }
];

const ensureTaskAccess = (task, user) => {
  const isAssignee = String(task.assignedTo?._id || task.assignedTo) === String(user._id);
  const projectMembers = task.project?.members || [];
  const isProjectMember = projectMembers.some((id) => String(id?._id || id) === String(user._id));

  if (user.role !== 'ADMIN' && !isAssignee && !isProjectMember) {
    throw new ApiError(403, 'You cannot access this task');
  }
};

export const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project) throw new ApiError(404, 'Project not found');

  const isAssignedMember = project.members.some((member) => String(member) === String(req.body.assignedTo));
  if (!isAssignedMember) {
    throw new ApiError(400, 'Assigned user must be a project member');
  }

  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  await task.populate(taskPopulate);
  res.status(201).json({ success: true, task });
});

export const getTasks = asyncHandler(async (req, res) => {
  const query = buildTaskQuery(req);

  if (req.user.role !== 'ADMIN') {
    const memberProjects = await Project.find({ members: req.user._id }).select('_id');
    query.$and = [
      ...(query.$and || []),
      {
        $or: [
          { assignedTo: req.user._id },
          { project: { $in: memberProjects.map((project) => project._id) } }
        ]
      }
    ];
  }

  const tasks = await Task.find(query).sort('-createdAt').populate(taskPopulate);
  res.json({ success: true, tasks });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(taskPopulate);
  if (!task) throw new ApiError(404, 'Task not found');

  ensureTaskAccess(task, req.user);
  res.json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  const project = await Project.findById(req.body.project);
  if (!project) throw new ApiError(404, 'Project not found');

  const isAssignedMember = project.members.some((member) => String(member) === String(req.body.assignedTo));
  if (!isAssignedMember) {
    throw new ApiError(400, 'Assigned user must be a project member');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate(taskPopulate);

  res.json({ success: true, task: updatedTask });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted' });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(taskPopulate);
  if (!task) throw new ApiError(404, 'Task not found');

  const isAssignee = String(task.assignedTo._id) === String(req.user._id);
  if (req.user.role !== 'ADMIN' && !isAssignee) {
    throw new ApiError(403, 'Members can update only their assigned task status');
  }

  task.status = req.body.status;
  await task.save();
  await task.populate(taskPopulate);

  res.json({ success: true, task });
});

export const addTaskComment = asyncHandler(async (req, res) => {
  if (!req.body.body?.trim()) {
    throw new ApiError(400, 'Comment body is required');
  }

  const task = await Task.findById(req.params.id).populate(taskPopulate);
  if (!task) throw new ApiError(404, 'Task not found');

  ensureTaskAccess(task, req.user);
  task.comments.push({ body: req.body.body, user: req.user._id });
  await task.save();
  await task.populate(taskPopulate);

  res.status(201).json({ success: true, task });
});
