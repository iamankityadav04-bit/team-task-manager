import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const countBy = (items, field, values) => {
  return values.reduce((acc, value) => {
    acc[value] = items.filter((item) => item[field] === value).length;
    return acc;
  }, {});
};

export const getDashboardStats = asyncHandler(async (req, res) => {
  const projectQuery = req.user.role === 'ADMIN' ? {} : { members: req.user._id };
  const projects = await Project.find(projectQuery).select('_id title createdAt');
  const projectIds = projects.map((project) => project._id);

  const taskQuery =
    req.user.role === 'ADMIN'
      ? {}
      : { $or: [{ assignedTo: req.user._id }, { project: { $in: projectIds } }] };

  const tasks = await Task.find(taskQuery)
    .populate('assignedTo', 'name avatar')
    .populate('project', 'title')
    .sort('-createdAt');

  const now = new Date();
  const overdueTasks = tasks.filter((task) => task.status !== 'COMPLETED' && new Date(task.dueDate) < now);
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED');
  const pendingTasks = tasks.filter((task) => task.status !== 'COMPLETED');

  res.json({
    success: true,
    stats: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      overdueTasks: overdueTasks.length,
      tasksByPriority: countBy(tasks, 'priority', ['LOW', 'MEDIUM', 'HIGH']),
      tasksByStatus: countBy(tasks, 'status', ['TODO', 'IN_PROGRESS', 'COMPLETED']),
      recentTasks: tasks.slice(0, 6),
      recentProjects: projects.slice(0, 6)
    }
  });
});
