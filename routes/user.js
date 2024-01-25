import express from "express";
import { body } from "express-validator";
import { userController } from "../controllers/index.js";
import authJwt from "../middleware/authJwt.js";

const userRouter = express.Router();

userRouter.post("/register",
	body("email").isEmail().withMessage('Email invalid format!'),
	body("password").isLength({ min: 8 }).withMessage('Password must be greater than or equal 8'),
	userController.register
);

userRouter.get("/money", authJwt.verifyToken, userController.getMoney);

userRouter.post("/login", userController.login);

userRouter.get("/activate" ,userController.activateAccount);

userRouter.post("/goToChat", userController.goToChat);

userRouter.post("/checkExsitedChat", userController.checkExistedChat);

userRouter.post("/genGuest", userController.genGuest)

export default userRouter;