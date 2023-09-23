import express from 'express';
import { messageController } from '../controller/index.js';

const messageRouter = express.Router();

messageRouter.get('/all', messageController.getAllMessage)

export default messageRouter;