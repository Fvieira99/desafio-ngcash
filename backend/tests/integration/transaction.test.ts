import { prisma } from "../../src/database/db.js";
import supertest from "supertest";

import app from "../../src/app.js";
import { createUserData } from "../factories/userFactory.js";
import {
	existingTwoUsersScenario,
	existingUserScenario,
} from "../factories/scnenarios/userScenario.js";
import { createTransactionData } from "../factories/transactionFactory.js";

const agent = supertest(app);

beforeEach(async () => {
	await prisma.$executeRaw`TRUNCATE "Transactions" CASCADE`;
});

describe("POST /cashout", () => {
	it("Should create transaction given and return status code 200", async () => {
		const { debitedUser, creditedUser } = await existingTwoUsersScenario();
		const transactionData = createTransactionData(creditedUser.id, 5000);

		const { body } = await agent.post("/signin").send(debitedUser);

		const response = await agent
			.post("/cashout")
			.send(transactionData)
			.set("Authorization", `Bearer ${body.token}`);

		expect(response.statusCode).toBe(200);
	});
});
