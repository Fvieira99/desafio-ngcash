import userRepository, {
	inputUserData,
} from "../repositories/userRepository.js";
import {
	conflictError,
	notFoundError,
	unauthorizedError,
} from "../utils/errors.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signUp(data: inputUserData) {
	const existingUser = await userRepository.findUserByUsername(data.username);

	if (existingUser) {
		throw conflictError("Username is already being used!");
	}

	const newUser = { ...data, password: encryptPassword(data.password) };

	await userRepository.createUserAndAccount(newUser);
}

async function signIn(data: inputUserData) {
	const existingUser = await userRepository.findUserByUsername(data.username);

	if (!existingUser || !decryptPassword(data.password, existingUser.password)) {
		throw unauthorizedError(
			"Your credentials are not valid! Please make sure that both field are correct!"
		);
	}

	const token = generateToken(existingUser.id);

	return token;
}

async function getUserInfo(userId: number) {
	const user = await userRepository.findUserById(userId);

	if (!user) {
		throw notFoundError("Usuário não existe!");
	}

	return {
		username: user.username,
		userId: user.id,
		account: user.account,
	};
}

export function encryptPassword(password: string): string {
	const SALT = 10;

	return bcrypt.hashSync(password, SALT);
}

function decryptPassword(
	inputUserPassword: string,
	dbUserPassword: string
): boolean {
	return bcrypt.compareSync(inputUserPassword, dbUserPassword);
}

function generateToken(userId: number): string {
	const JWT_DATA = { userId };
	const JWT_KEY = process.env.JWT_SECRET;
	const JWT_CONFIG = { expiresIn: "1 day" };

	return jwt.sign(JWT_DATA, JWT_KEY, JWT_CONFIG);
}

const userService = {
	signUp,
	signIn,
	getUserInfo,
};

export default userService;
