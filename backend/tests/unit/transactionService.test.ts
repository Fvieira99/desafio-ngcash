import { jest } from "@jest/globals";

import transactioService from "../../src/services/transactionService.js";
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

		await transactioService.cashOut(transactionData, debitedAccountOwnerId);

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

		const promise = transactioService.cashOut(
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

		const promise = transactioService.cashOut(
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

		const promise = transactioService.cashOut(
			transactionData,
			debitedAccountOwnerId
		);

		expect(promise).rejects.toEqual(badRequestError("Saldo Insuficente!"));
	});
});
