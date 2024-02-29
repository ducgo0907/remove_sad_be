import express from 'express';
import messageRouter from './message.js';
import userRouter from './user.js';
import scheduleRouter from './schedule.js';
import orderRouter from './order.js';
import meetRouter from './meet.js'

const router = express.Router();

router.use('/messages', messageRouter);
router.use('/users', userRouter);
router.use('/schedule', scheduleRouter)
router.use('/order', orderRouter);
router.use('/meet', meetRouter)

export default router;