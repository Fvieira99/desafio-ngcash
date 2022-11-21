import Joi from "joi";
import { InputTransactionData } from "../controllers/transactionController.js";

const transactionSchema = Joi.object<InputTransactionData>({
	creditedAccountOwnerUsername: Joi.string().required(),
	value: Joi.number().required().min(1),
});

export default transactionSchema;
