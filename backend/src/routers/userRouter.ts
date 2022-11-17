import { Router } from "express";
import userController from "../controllers/userController.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import validateToken from "../middlewares/validateTokenMiddleware.js";
import userSchema from "../schemas/userSchema.js";

const userRouter = Router();

userRouter.post("/signup", validateSchema(userSchema), userController.signUp);
userRouter.post("/signin", userController.signIn);
userRouter.get("/user-info", validateToken, userController.getUserInfo);

export default userRouter;
