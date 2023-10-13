import express from 'express';
import { messageController } from '../controllers/index.js';
import authJwt from '../middleware/authJwt.js';

const messageRouter = express.Router();

messageRouter.get('/all', [authJwt.verifyToken], messageController.getAllMessage);

messageRouter.post('/save', authJwt.verifyToken, messageController.saveMessage);

messageRouter.get('/listUser', [authJwt.verifyToken, authJwt.isAdmin], messageController.getListUser);

messageRouter.get('/getPylir', [authJwt.verifyToken], messageController.getPylir );

export default messageRouter;