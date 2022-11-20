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
			"It is not possible to make the transaction, because one of the accounts does not exist!"
		);
	}

	if (creditedAccount.id === debitedAccount.id) {
		throw badRequestError(
			"It is not possible to make a transaction to your own account!"
		);
	}

	if (!validateBalance(debitedAccount.balance, data.value)) {
		throw badRequestError("Not enough balance!");
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

	if (!user) {
		throw badRequestError("User does not exist!");
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

const transactionService = {
	cashOut,
	findUserTransactions,
};

export default transactionService;
