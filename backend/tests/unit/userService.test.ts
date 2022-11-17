import { jest } from "@jest/globals";

import userRepository from "../../src/repositories/userRepository.js";
import userService from "../../src/services/userService.js";
import { createUserData } from "../factories/userFactory.js";
import {
	conflictError,
	notFoundError,
	unauthorizedError,
} from "../../src/utils/errors.js";
import { encryptPassword } from "../../src/services/userService.js";

beforeEach(() => {
	jest.clearAllMocks();
	jest.resetAllMocks();
});

describe("User Service Test Suit!", () => {
	jest
		.spyOn(userRepository, "createUserAndAccount")
		.mockImplementation((): any => {});

	jest
		.spyOn(userRepository, "findUserByUsername")
		.mockImplementation((): any => {});

	jest.spyOn(userRepository, "findUserById").mockImplementation((): any => {});

	it("Given nonexisting username it should create new user and new account!", async () => {
		const user = createUserData();

		await userService.signUp(user);

		expect(userRepository.findUserByUsername).toBeCalledTimes(1);
		expect(userRepository.createUserAndAccount).toBeCalledTimes(1);
	});

	it("Given existing username it shouldn't create new user and new account!", async () => {
		const user = createUserData();

		jest
			.spyOn(userRepository, "findUserByUsername")
			.mockImplementationOnce((): any => {
				return {
					id: 1,
					username: user.username,
					password: "hashedPassword",
					accountId: 1,
				};
			});

		const promise = userService.signUp(user);

		expect(promise).rejects.toEqual(
			conflictError("Username is already being used!")
		);

		expect(userRepository.findUserByUsername).toBeCalledTimes(1);
		expect(userRepository.createUserAndAccount).toBeCalledTimes(0);
	});

	it("Given correct user data it should sign in!", async () => {
		const user = createUserData();

		jest
			.spyOn(userRepository, "findUserByUsername")
			.mockImplementationOnce((): any => {
				return {
					id: 1,
					username: user.username,
					password: encryptPassword(user.password),
					accountId: 1,
				};
			});

		const token = await userService.signIn(user);

		expect(token).not.toBeNull();
		expect(userRepository.findUserByUsername).toBeCalledTimes(1);
	});

	it("Given nonexisting username it shouldn't sign in!", async () => {
		const user = createUserData();

		const promise = userService.signIn(user);

		expect(promise).rejects.toEqual(
			unauthorizedError(
				"Your credentials are not valid! Please make sure that both field are correct!"
			)
		);
	});

	it("Given incorrect password it shouldn't sign in!", async () => {
		const user = createUserData();

		jest
			.spyOn(userRepository, "findUserByUsername")
			.mockImplementationOnce((): any => {
				return {
					id: 1,
					username: user.username,
					password: "incorrectPassword",
					accountId: 1,
				};
			});

		const promise = userService.signIn(user);

		expect(promise).rejects.toEqual(
			unauthorizedError(
				"Your credentials are not valid! Please make sure that both field are correct!"
			)
		);
	});

	it("Given valid userId it should return user info!", async () => {
		const userId = 1;

		jest
			.spyOn(userRepository, "findUserById")
			.mockImplementationOnce((): any => {
				return {
					username: "User",
					userId: 1,
					account: {
						accountId: 1,
						balance: 10000,
					},
				};
			});

		const response = await userService.getUserInfo(userId);

		expect(response).not.toBeNull();
		expect(response.username).toBe("User");
		expect(userRepository.findUserById).toBeCalledTimes(1);
	});

	it("Given nonexisting userId it should not return user info!", async () => {
		const userId = 1;

		const promise = userService.getUserInfo(userId);

		expect(promise).rejects.toEqual(notFoundError("Usuário não existe!"));
	});
});
