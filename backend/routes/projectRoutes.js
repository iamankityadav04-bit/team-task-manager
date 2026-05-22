import express from 'express';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from '../controllers/projectController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { validate, validateObjectId } from '../middleware/validate.js';
import { projectRules } from '../validators/projectValidators.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getProjects).post(authorize('ADMIN'), validate(projectRules), createProject);
router
  .route('/:id')
  .get(validateObjectId(), getProjectById)
  .put(authorize('ADMIN'), validateObjectId(), validate(projectRules), updateProject)
  .delete(authorize('ADMIN'), validateObjectId(), deleteProject);

export default router;
