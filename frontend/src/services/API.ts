import axios from "axios";
import { SignInData } from "../pages/SignIn";
import { SignUpData } from "../pages/SignUp";

interface RequestConfig {
	headers: {
		Authorization: string;
	};
}

const API = axios.create({
	baseURL: "http://localhost:5000/",
});

function buildConfig(token: string): RequestConfig {
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
}

async function signUp(data: SignUpData) {
	return API.post("/signup", data);
}

async function signIn(data: SignInData) {
	return API.post("/signin", data);
}

const apiService = {
	signIn,
	signUp,
};

export default apiService;
