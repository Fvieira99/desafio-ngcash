import { Prisma, PrismaPromise, Transaction } from "@prisma/client";
import { prisma } from "../database/db.js";

export type CreateTransactionData = Omit<Transaction, "id" | "createdAt">;
export type OrderByFilter = "asc" | "desc" | undefined;
export type WhereFilter = "debitedAccountId" | "creditedAccountId" | undefined;

export interface TransactionFilters {
	whereFilter: WhereFilter;
	orderByFilter: OrderByFilter;
}

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

async function findUserTransactions(
	userId: number,
	whereFilter: WhereFilter,
	orderByFilter: OrderByFilter
) {
	return await prisma.transaction.findMany({
		where: buildWhereFilter(userId, whereFilter),
		orderBy: buildOrderByFilter(orderByFilter),
	});
}

function buildOrderByFilter(orderByFilter: OrderByFilter) {
	if (!orderByFilter) {
		return {};
	}
	return {
		createdAt: orderByFilter,
	};
}

function buildWhereFilter(
	userId: number,
	whereFilter: WhereFilter
): Prisma.TransactionWhereInput {
	if (!whereFilter) {
		return {
			OR: [{ creditedAccountId: userId }, { debitedAccountId: userId }],
		};
	}
	return {
		[whereFilter]: userId,
	};
}

const transactionRepository = {
	createTransaction,
	findUserTransactions,
};

export default transactionRepository;
