import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, completeTask } from '../controllers/taskController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/complete', completeTask);

export default router;
