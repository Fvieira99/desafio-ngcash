import userRepository, {
	inputUserData,
} from "../repositories/userRepository.js";
import { conflictError, unauthorizedError } from "../utils/errors.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signUp(data: inputUserData) {
	const existingUser = await userRepository.findUserByUsername(data.username);

	if (existingUser) {
		throw conflictError("Username is already being used!");
	}

	const newUser = { ...data, password: encryptPassword(data.password) };

	await userRepository.signUp(newUser);
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

function encryptPassword(password: string): string {
	const SALT = 10;

	return bcrypt.hashSync(password, SALT);
}

function decryptPassword(
	inputUserPassword: string,
	dbUserPassword: string
): boolean {
	return bcrypt.compareSync(inputUserPassword, dbUserPassword);
}

function generateToken(id: number): string {
	const JWT_DATA = { userId: id };
	const JWT_KEY = process.env.JWT_SECRET;
	const JWT_CONFIG = { expiresIn: "1 day" };

	return jwt.sign(JWT_DATA, JWT_KEY, JWT_CONFIG);
}

const userService = {
	signUp,
	signIn,
};

export default userService;
