import express from 'express';
import messageRouter from './message.js';

const router = express.Router();

router.use('/messages', messageRouter);

export default router;