import express from 'express';
import messageRouter from './message.js';
import userRouter from './user.js';
import scheduleRouter from './schedule.js';

const router = express.Router();

router.use('/messages', messageRouter);
router.use('/users', userRouter);
router.use('/schedule', scheduleRouter)

export default router;