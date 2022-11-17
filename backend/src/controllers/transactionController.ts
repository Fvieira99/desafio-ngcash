import { Request, Response } from "express";
import {
	OrderByFilter,
	WhereFilter,
} from "../repositories/transactionRepository.js";
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

async function findAllUserTransactions(req: Request, res: Response) {
	const { userId }: { userId: number } = res.locals.user;

	const whereFilter = req.query.whereFilter as WhereFilter;
	const orderByFilter = req.query.orderByFilter as OrderByFilter;

	const transactions = await transactioService.findUserTransactions(
		userId,
		whereFilter,
		orderByFilter
	);

	res.status(200).send(transactions);
}

const transactionController = {
	cashOut,
	findAllUserTransactions,
};

export default transactionController;
