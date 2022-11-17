import { Router } from "express";
import transactionRouter from "./transactionRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use(userRouter);
router.use(transactionRouter);

export default router;
