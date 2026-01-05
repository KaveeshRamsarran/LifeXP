import { Router } from 'express';
import { getMe } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getMe);

export default router;
