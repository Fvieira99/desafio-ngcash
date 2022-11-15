import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

const typeToStatusCode = {
	bad_request: 400,
	not_found: 404,
	unauthorized: 401,
	conflict: 409,
	wrong_schema: 422,
};

export default function errorHandler(
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err.type) {
		return res.status(typeToStatusCode[err.type]).send(err.message);
	}

	res.status(500).send("Internal server error.");
}
