import { Router } from "express";
import userController from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", userController.signUp);
userRouter.post("/signin", userController.signIn);

export default userRouter;
