import { jest } from "@jest/globals";

import transactionService from "../../src/services/transactionService.js";
import transactionRepository from "../../src/repositories/transactionRepository.js";
import userRepository from "../../src/repositories/userRepository.js";
import { createTransactionData } from "../factories/transactionFactory.js";
import { badRequestError } from "../../src/utils/errors.js";

describe("Transaction service unit test suit", () => {
	jest.spyOn(userRepository, "findUserById").mockImplementation((): any => {});

	jest
		.spyOn(transactionRepository, "createTransaction")
		.mockImplementation((): any => {});

	it("Should create transaction given different account ids and if the debitedAccount has enough money to make the transaction", async () => {
		const transactionData = createTransactionData();
		const debitedAccountOwnerId = 1;

		jest
			.spyOn(userRepository, "findUserById")
			.mockImplementationOnce((): any => {
				return {
					account: {
						id: 1,
						balance: 10000,
					},
				};
			})
			.mockImplementationOnce((): any => {
				return {
					account: {
						id: 2,
						balance: 10000,
					},
				};
			});

		await transactionService.cashOut(transactionData, debitedAccountOwnerId);

		expect(transactionRepository.createTransaction).toBeCalledTimes(1);
	});

	it("Should throw error if one of the involved accounts does not exist!", async () => {
		const transactionData = createTransactionData();
		const debitedAccountOwnerId = 1;

		jest
			.spyOn(userRepository, "findUserById")
			.mockImplementationOnce((): any => {
				return {
					account: {
						id: 1,
						balance: 10000,
					},
				};
			})
			.mockImplementationOnce((): any => {
				return null;
			});

		const promise = transactionService.cashOut(
			transactionData,
			debitedAccountOwnerId
		);

		expect(promise).rejects.toEqual(
			badRequestError(
				"Impossível realizar a transação de ou para uma conta que não existe!"
			)
		);
	});

	it("Should throw error if credited account and debited account are the same account!", async () => {
		const transactionData = createTransactionData(1, 5000);
		const debitedAccountOwnerId = 1;

		jest
			.spyOn(userRepository, "findUserById")
			.mockImplementationOnce((): any => {
				return {
					account: {
						id: 1,
						balance: 10000,
					},
				};
			})
			.mockImplementationOnce((): any => {
				return {
					account: {
						id: 1,
						balance: 10000,
					},
				};
			});

		const promise = transactionService.cashOut(
			transactionData,
			debitedAccountOwnerId
		);

		expect(promise).rejects.toEqual(
			badRequestError(
				"Impossível realizar a transferência para a sua própria conta!"
			)
		);
	});

	it("Should throw error if credited account and debited account are the same account!", async () => {
		const transactionData = createTransactionData(2, 11000);
		const debitedAccountOwnerId = 1;

		jest
			.spyOn(userRepository, "findUserById")
			.mockImplementationOnce((): any => {
				return {
					account: {
						id: 1,
						balance: 10000,
					},
				};
			})
			.mockImplementationOnce((): any => {
				return {
					account: {
						id: 2,
						balance: 10000,
					},
				};
			});

		const promise = transactionService.cashOut(
			transactionData,
			debitedAccountOwnerId
		);

		expect(promise).rejects.toEqual(badRequestError("Saldo Insuficente!"));
	});

	it("Should return user transactions given none or correct filters", async () => {
		const whereFilter = "debitedAccountId";
		const orderByFilter = "desc";
		const userId = 1;

		jest
			.spyOn(userRepository, "findUserById")
			.mockImplementationOnce((): any => {
				return {
					userId: 1,
				};
			});

		jest
			.spyOn(transactionRepository, "findUserTransactions")
			.mockImplementationOnce((): any => {
				return [
					{
						id: 1,
						creditedAccountId: 2,
						debitedAccountId: 1,
						value: 2000,
					},
				];
			});

		const userTransactions = await transactionService.findUserTransactions(
			userId,
			whereFilter,
			orderByFilter
		);

		expect(userTransactions.length).toBe(1);
	});

	it("Should return error if user does not exist!", async () => {
		const whereFilter = "creditedAccountId";
		const orderByFilter = "desc";
		const userId = 1;

		const promise = transactionService.findUserTransactions(
			userId,
			whereFilter,
			orderByFilter
		);

		expect(promise).rejects.toEqual(badRequestError("Usuário não existe!"));
	});
});
