import express from 'express';
import authJwt from '../middleware/authJwt.js';
import { scheduleController } from '../controllers/index.js';

const scheduleRouter = express.Router();

scheduleRouter.post('/schedule', [authJwt.verifyToken], scheduleController.createSchedule);

export default scheduleRouter;