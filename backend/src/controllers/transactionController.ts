import { Request, Response } from "express";
import {
	OrderByFilter,
	WhereFilter,
} from "../repositories/transactionRepository.js";
import transactionService from "../services/transactionService.js";

export interface InputTransactionData {
	creditedAccountOwnerUsername: string;
	value: number;
}

async function cashOut(req: Request, res: Response) {
	const { userId }: { userId: number } = res.locals.user;
	const body: InputTransactionData = req.body;

	await transactionService.cashOut(body, userId);

	res.status(200).send("Successfull transaction!");
}

async function findAllUserTransactions(req: Request, res: Response) {
	const { userId }: { userId: number } = res.locals.user;

	const whereFilter = req.query.whereFilter as WhereFilter;
	const orderByFilter = req.query.orderByFilter as OrderByFilter;

	if (
		!validateWhereFilter(whereFilter) ||
		!validateOrderByFilter(orderByFilter)
	) {
		return res.status(400).send("Invalid Filters!");
	}

	const transactions = await transactionService.findUserTransactions(
		userId,
		whereFilter,
		orderByFilter
	);

	res.status(200).send(transactions);
}

function validateWhereFilter(whereFilter: WhereFilter): boolean {
	if (
		whereFilter !== "debitedAccountId" &&
		whereFilter !== "creditedAccountId" &&
		whereFilter !== undefined
	) {
		return false;
	}

	return true;
}

function validateOrderByFilter(orderByFilter: OrderByFilter): boolean {
	if (
		orderByFilter !== "asc" &&
		orderByFilter !== "desc" &&
		orderByFilter !== undefined
	) {
		return false;
	}
	return true;
}

const transactionController = {
	cashOut,
	findAllUserTransactions,
};

export default transactionController;
