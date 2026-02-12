import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';

const router = Router();

router.post('/', orderController.create);
router.get('/:id', orderController.getById);
router.patch('/:id/status', orderController.updateStatus);

export default router;
