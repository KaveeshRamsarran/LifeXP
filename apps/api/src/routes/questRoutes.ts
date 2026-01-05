import { Router } from 'express';
import { getTodayQuests, completeQuest } from '../controllers/questController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/today', getTodayQuests);
router.post('/:id/complete', completeQuest);

export default router;
