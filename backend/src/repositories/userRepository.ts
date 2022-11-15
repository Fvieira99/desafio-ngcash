import { User } from "@prisma/client";
import { prisma } from "../database/db.js";

export type inputUserData = Omit<User, "id" | "accountId">;

async function findUserByUsername(username: string) {
	return await prisma.user.findUnique({
		where: {
			username,
		},
	});
}

async function signUp(data: inputUserData) {
	await prisma.user.create({
		data: {
			username: data.username,
			password: data.password,
			account: {
				create: {
					balance: 10000,
				},
			},
		},
	});
}

const userRepository = {
	signUp,
	findUserByUsername,
};

export default userRepository;
