import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { unauthorizedError } from "../utils/errors.js";

interface DecodedToken {
	userId: number;
}

export default function validateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authorization = req.headers["authorization"];
	const token = authorization?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).send("Você não possui um token!");
	}

	const user = jwt.verify(token, process.env.JWT_SECRET, verifyIfTokenIsValid);

	res.locals.user = user;

	next();
}

function verifyIfTokenIsValid(
	err: JsonWebTokenError,
	decoded: DecodedToken
): DecodedToken {
	if (err) {
		throw unauthorizedError("Your token is not valid!");
	}

	return decoded;
}
