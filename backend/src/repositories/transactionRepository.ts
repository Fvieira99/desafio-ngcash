import { Transaction } from "@prisma/client";
import { prisma } from "../database/db.js";

export type CreateTransactionData = Omit<Transaction, "id" | "createdAt">;

async function createTransaction(transactionData: CreateTransactionData) {
	await prisma.$transaction([
		prisma.account.update({
			where: {
				id: transactionData.debitedAccountId,
			},
			data: {
				balance: {
					decrement: transactionData.value,
				},
			},
		}),

		prisma.account.update({
			where: {
				id: transactionData.creditedAccountId,
			},
			data: {
				balance: {
					increment: transactionData.value,
				},
			},
		}),

		prisma.transaction.create({ data: transactionData }),
	]);
}

const transactionRepository = {
	createTransaction,
};

export default transactionRepository;
