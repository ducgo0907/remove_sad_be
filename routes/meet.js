import express from 'express';
import authJwt from '../middleware/authJwt.js';
import { meetController } from '../controllers/index.js';

const meetRouter = express.Router();

meetRouter.post('/create', [authJwt.verifyToken], meetController.create);
meetRouter.post('/approve', [authJwt.verifyToken], meetController.approve);
meetRouter.get('/get-all', [authJwt.verifyToken], meetController.getAll);
meetRouter.get('/get-by-user', [authJwt.verifyToken], meetController.getByCustomerId);


export default meetRouter;