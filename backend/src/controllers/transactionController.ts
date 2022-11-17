import { Request, Response } from "express";
import transactioService from "../services/transactionService.js";

export interface InputTransactionData {
	creditedAccountOwnerId: number;
	value: number;
}

async function cashOut(req: Request, res: Response) {
	const { userId }: { userId: number } = res.locals.user;
	const body: InputTransactionData = req.body;

	await transactioService.cashOut(body, userId);

	res.status(200).send("Transação realizada com sucesso!");
}

const transactionController = {
	cashOut,
};

export default transactionController;
