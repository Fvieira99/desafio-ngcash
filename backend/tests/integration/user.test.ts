import { prisma } from "../../src/database/db.js";
import supertest from "supertest";

import app from "../../src/app.js";
import { createUserData } from "../factories/userFactory.js";
import { existingUserScenario } from "../factories/scnenarios/userScenario.js";

const agent = supertest(app);

beforeEach(async () => {
	await prisma.$executeRaw`TRUNCATE "Accounts" CASCADE`;
});

describe("POST /signup integration test suit", () => {
	it("Should create user and account and return code 201!", async () => {
		const user = createUserData();

		const response = await agent.post("/signup").send(user);
		expect(response.statusCode).toBe(201);

		const createdUser = await prisma.user.findUnique({
			where: {
				username: user.username,
			},
		});

		expect(createdUser).not.toBeNull();
		expect(createdUser.password).not.toBe(user.password);
	});

	it("Should return code 422 given password with length lower than 8", async () => {
		const user = createUserData(4);

		const response = await agent.post("/signup").send(user);

		expect(response.statusCode).toBe(422);

		const createdUser = await prisma.user.findUnique({
			where: {
				username: user.username,
			},
		});

		expect(createdUser).toBeNull();
	});

	it("Should return code 422 given incorrect password pattern", async () => {
		const user = createUserData(6, false);

		const response = await agent.post("/signup").send(user);

		expect(response.statusCode).toBe(422);

		const createdUser = await prisma.user.findUnique({
			where: {
				username: user.username,
			},
		});

		expect(createdUser).toBeNull();
	});

	it("Should return code 422 given username with length lower than 3", async () => {
		const user = createUserData();

		const response = await agent
			.post("/signup")
			.send({ username: "ab", password: user.password });

		expect(response.statusCode).toBe(422);

		const createdUser = await prisma.user.findUnique({
			where: {
				username: user.username,
			},
		});

		expect(createdUser).toBeNull();
	});

	it("Should return status code 409 given existing username", async () => {
		const user = await existingUserScenario();

		const response = await agent.post("/signup").send(user);

		expect(response.statusCode).toBe(409);
	});
});

describe("POST /singin integration test suit", () => {
	it("Should return status code 200 and token given corret user data", async () => {
		const user = await existingUserScenario();

		const response = await agent.post("/signin").send(user);

		expect(response.statusCode).toBe(200);
		expect(response.body).not.toBeNull();
	});

	it("Should return status code 401 given nonexisting username", async () => {
		const user = createUserData();

		const response = await agent.post("/signin").send(user);

		expect(response.statusCode).toBe(401);
	});

	it("Should return status code 401 given incorrect password username", async () => {
		const user = await existingUserScenario();

		const response = await agent
			.post("/signin")
			.send({ ...user, password: "wrong_password" });

		expect(response.statusCode).toBe(401);
	});
});

afterAll(async () => {
	await prisma.$executeRaw`TRUNCATE "Accounts" CASCADE;`;
	prisma.$disconnect();
});
