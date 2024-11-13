import { Router } from 'express';
import passwordController from '../controllers/passwordController';

const router = Router();

router.post('/request-password-reset', passwordController.requestPasswordReset);
router.post('/reset-password/:token', passwordController.resetPassword);

export default router;
