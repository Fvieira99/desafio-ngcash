import { prisma } from "../../src/database/db.js";
import supertest from "supertest";

import app from "../../src/app.js";
import { existingTwoUsersScenario } from "../factories/scnenarios/userScenario.js";
import { createTransactionData } from "../factories/transactionFactory.js";

const agent = supertest(app);

beforeEach(async () => {
	await prisma.$executeRaw`TRUNCATE "Transactions" CASCADE`;
});

describe("POST /cashout", () => {
	it("Should create transaction given and return status code 200", async () => {
		const { debitedUser, creditedUser } = await existingTwoUsersScenario();
		const transactionData = createTransactionData(creditedUser.username, 5000);

		const { body } = await agent.post("/signin").send(debitedUser);

		const response = await agent
			.post("/transactions/cashout")
			.send(transactionData)
			.set("Authorization", `Bearer ${body.token}`);

		expect(response.statusCode).toBe(200);
	});
});

describe("GET /transactions", () => {
	it("Should return user transactions given none or correct query params", async () => {
		const { debitedUser } = await existingTwoUsersScenario();

		const whereFilter = "debitedAccountId";
		const orderByFilter = "asc";

		const { body } = await agent.post("/signin").send(debitedUser);

		const response = await agent
			.get("/transactions")
			.set("Authorization", `Bearer ${body.token}`)
			.query({ whereFilter, orderByFilter });
		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(0);
	});

	it("Should return status code 400 if at least one of the query string params is not valid!", async () => {
		const { debitedUser } = await existingTwoUsersScenario();

		const whereFilter = "wrongfilter";
		const orderByFilter = "wrongfilter";

		const { body } = await agent.post("/signin").send(debitedUser);

		const response = await agent
			.get("/transactions")
			.set("Authorization", `Bearer ${body.token}`)
			.query({ whereFilter, orderByFilter });
		expect(response.statusCode).toBe(400);
		expect(response.text).toBe("Invalid Filters!");
	});
});

afterAll(async () => {
	await prisma.$executeRaw`TRUNCATE "Transactions" CASCADE;`;
	prisma.$disconnect();
});
