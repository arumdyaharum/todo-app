import express from 'express';
import authenticateToken from '../middleware/auth.js';
import Todo from '../controllers/todo.js';
import { validateTodo } from '../validators/validator.js';
import handleValidationErrors from '../middleware/validation.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/all', Todo.getTodos);
router.post('/', validateTodo, handleValidationErrors, Todo.createTodo);
router.put('/:todoId', Todo.updateTodo);
router.delete('/:todoId', Todo.deleteTodo);

export default router;