import { InputTransactionData } from "../controllers/transactionController.js";
import transactionRepository from "../repositories/transactionRepository.js";
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

function validateBalance(debitedAccountBalance: number, valueDebited: number) {
	if (debitedAccountBalance - valueDebited < 0) {
		return false;
	}

	return true;
}

const transactioService = {
	cashOut,
};

export default transactioService;
