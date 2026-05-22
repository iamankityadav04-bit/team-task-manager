import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const projectPopulate = [
  { path: 'createdBy', select: 'name email avatar role' },
  { path: 'members', select: 'name email avatar role' }
];

export const createProject = asyncHandler(async (req, res) => {
  const memberIds = Array.from(new Set([...(req.body.members || []), String(req.user._id)]));
  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    members: memberIds,
    createdBy: req.user._id
  });

  await project.populate(projectPopulate);
  res.status(201).json({ success: true, project });
});

export const getProjects = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'ADMIN' ? {} : { members: req.user._id };
  const projects = await Project.find(filter).sort('-createdAt').populate(projectPopulate);
  res.json({ success: true, projects });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(projectPopulate);
  if (!project) throw new ApiError(404, 'Project not found');

  const isMember = project.members.some((member) => String(member._id) === String(req.user._id));
  if (req.user.role !== 'ADMIN' && !isMember) {
    throw new ApiError(403, 'You cannot view this project');
  }

  const tasks = await Task.find({ project: project._id })
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort('-createdAt');

  res.json({ success: true, project, tasks });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      members: req.body.members
    },
    { new: true, runValidators: true }
  ).populate(projectPopulate);

  if (!project) throw new ApiError(404, 'Project not found');
  res.json({ success: true, project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ success: true, message: 'Project and related tasks deleted' });
});
