import express from 'express';
import authRoutes from './auth.js';
import todoRoutes from './todo.js';
import projectRoutes from './project.js';

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/todo", todoRoutes);
router.use("/project", projectRoutes);

export default router;