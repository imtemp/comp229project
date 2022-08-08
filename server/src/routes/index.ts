import { Router } from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import SurveyRouter from './Survey';

const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/surveys', SurveyRouter);

export default router;
