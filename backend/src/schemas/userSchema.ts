import Joi from "joi";
import { inputUserData } from "../repositories/userRepository.js";

export const pwPattern = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;

const userSchema = Joi.object<inputUserData>({
	username: Joi.string().min(3).required(),
	password: Joi.string().min(8).pattern(pwPattern).required(),
});

export default userSchema;
