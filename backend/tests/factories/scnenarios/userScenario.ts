import { prisma } from "../../../src/database/db.js";
import { encryptPassword } from "../../../src/services/userService.js";
import { createUserData } from "../userFactory.js";

export async function existingUserScenario() {
	const user = createUserData();

	const createdUser = await prisma.user.create({
		data: {
			username: user.username,
			password: encryptPassword(user.password),
			account: {
				create: {
					balance: 10000,
				},
			},
		},
	});

	return user;
}
