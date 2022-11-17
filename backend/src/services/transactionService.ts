import { InputTransactionData } from "../controllers/transactionController.js";
import transactionRepository, {
	OrderByFilter,
	WhereFilter,
} from "../repositories/transactionRepository.js";
import userRepository from "../repositories/userRepository.js";
import { badRequestError } from "../utils/errors.js";

async function cashOut(data: InputTransactionData, userId: number) {
	const debitedUser = await userRepository.findUserById(userId);
	const debitedAccount = debitedUser?.account;

	const creditedUser = await userRepository.findUserById(
		data.creditedAccountOwnerId
	);
	const creditedAccount = creditedUser?.account;

	if (!creditedAccount || !debitedAccount) {
		throw badRequestError(
			"Impossível realizar a transação de ou para uma conta que não existe!"
		);
	}

	if (creditedAccount.id === debitedAccount.id) {
		throw badRequestError(
			"Impossível realizar a transferência para a sua própria conta!"
		);
	}

	if (!validateBalance(debitedAccount.balance, data.value)) {
		throw badRequestError("Saldo Insuficente!");
	}

	await transactionRepository.createTransaction({
		creditedAccountId: creditedAccount.id,
		debitedAccountId: debitedAccount.id,
		value: data.value,
	});
}

async function findUserTransactions(
	userId: number,
	whereFilter: WhereFilter,
	orderByFilter: OrderByFilter
) {
	const user = await userRepository.findUserById(userId);

	if (
		!validateWhereFilter(whereFilter) ||
		!validateOrderByFilter(orderByFilter)
	) {
		throw badRequestError(
			"Filtros não disóníveis! Impossível realizar esta busca!"
		);
	}

	if (!user) {
		throw badRequestError("Not Found Error");
	}

	return await transactionRepository.findUserTransactions(
		userId,
		whereFilter,
		orderByFilter
	);
}

function validateBalance(debitedAccountBalance: number, valueDebited: number) {
	if (debitedAccountBalance - valueDebited < 0) {
		return false;
	}

	return true;
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

const transactioService = {
	cashOut,
	findUserTransactions,
};

export default transactioService;