import express from 'express';
import projectController from '../controllers/project.js';
import { validateProject } from '../validators/validator.js';
import handleValidationErrors from '../middleware/validation.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/all', projectController.getProjects);
router.post('/', validateProject, handleValidationErrors, projectController.createProject);
router.put('/:projectId', validateProject, handleValidationErrors, projectController.editProject);
router.delete('/:projectId', projectController.deleteProject);

export default router;