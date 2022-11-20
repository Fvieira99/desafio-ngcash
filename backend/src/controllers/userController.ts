import { Request, Response } from "express";
import { inputUserData } from "../repositories/userRepository.js";
import userService from "../services/userService.js";

async function signUp(req: Request, res: Response) {
	const data: inputUserData = req.body;

	await userService.signUp(data);

	res.sendStatus(201);
}

async function signIn(req: Request, res: Response) {
	const data: inputUserData = req.body;

	const token = await userService.signIn(data);

	res.status(200).send(token);
}
async function getUserInfo(req: Request, res: Response) {
	const { userId }: { userId: number } = res.locals.user;

	const account = await userService.getUserInfo(userId);

	res.status(200).send(account);
}

const userController = {
	signUp,
	signIn,
	getUserInfo,
};

export default userController;
