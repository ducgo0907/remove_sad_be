import express from 'express';
import { messageController } from '../controllers/index.js';

const messageRouter = express.Router();

messageRouter.get('/all', messageController.getAllMessage)

export default messageRouter;