import express from 'express';
import messageRouter from './message.js';
import userRouter from './user.js';

const router = express.Router();

router.use('/messages', messageRouter);
router.use('/users', userRouter);

export default router;