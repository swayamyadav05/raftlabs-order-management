import { Router } from 'express';
import menuRoutes from './menu.routes.js';
import orderRoutes from './order.routes.js';

const router = Router();

router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);

export default router;
