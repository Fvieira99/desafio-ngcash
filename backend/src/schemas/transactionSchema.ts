import Joi from "joi";
import { InputTransactionData } from "../controllers/transactionController.js";

const transactionSchema = Joi.object<InputTransactionData>({
	creditedAccountOwnerId: Joi.number().required(),
	value: Joi.number().required(),
});

export default transactionSchema;
