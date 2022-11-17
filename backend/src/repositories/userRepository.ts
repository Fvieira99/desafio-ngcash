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

async function createUserAndAccount(data: inputUserData) {
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

async function findUserById(id: number) {
	return await prisma.user.findUnique({
		where: { id },
		include: {
			account: true,
		},
	});
}

const userRepository = {
	createUserAndAccount,
	findUserByUsername,
	findUserById,
};

export default userRepository;
