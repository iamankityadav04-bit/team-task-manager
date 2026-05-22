import express from 'express';
import {
  addTaskComment,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus
} from '../controllers/taskController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { validate, validateObjectId } from '../middleware/validate.js';
import { taskRules, taskStatusRules } from '../validators/taskValidators.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getTasks).post(authorize('ADMIN'), validate(taskRules), createTask);
router.patch('/:id/status', validateObjectId(), validate(taskStatusRules), updateTaskStatus);
router.post('/:id/comments', validateObjectId(), addTaskComment);
router
  .route('/:id')
  .get(validateObjectId(), getTaskById)
  .put(authorize('ADMIN'), validateObjectId(), validate(taskRules), updateTask)
  .delete(authorize('ADMIN'), validateObjectId(), deleteTask);

export default router;
