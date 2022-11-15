import bcrypt from "bcrypt";
import { jest } from "@jest/globals";

import userRepository from "../../src/repositories/userRepository.js";
import userService from "../../src/services/userService.js";
import { createUserData } from "../factories/userFactory.js";
import { conflictError, unauthorizedError } from "../../src/utils/errors.js";
import { encryptPassword } from "../../src/services/userService.js";
import { User } from "@prisma/client";

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
});
