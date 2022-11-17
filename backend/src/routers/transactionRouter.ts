import { Router } from "express";
import transactionController from "../controllers/transactionController.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import validateToken from "../middlewares/validateTokenMiddleware.js";
import transactionSchema from "../schemas/transactionSchema.js";

const transactionRouter = Router();

transactionRouter.post(
	"/cashout",
	validateToken,
	validateSchema(transactionSchema),
	transactionController.cashOut
);

export default transactionRouter;
