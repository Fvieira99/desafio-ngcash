import axios from "axios";
import { CashoutData } from "../pages/Cashout";
import { SignInData } from "../pages/SignIn";
import { SignUpData } from "../pages/SignUp";
import { Filters } from "../pages/Transactions";

interface RequestConfig {
	headers: {
		Authorization: string;
	};
}

const API = axios.create({
	baseURL: "http://localhost:5000/",
});

function buildConfig(token: string | null): RequestConfig {
	console.log();
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
}

function signUp(data: SignUpData) {
	return API.post("/signup", data);
}

function signIn(data: SignInData) {
	return API.post("/signin", data);
}

function getUserInfo(token: string | null) {
	const config = buildConfig(token);

	console.log(config);

	return API.get("/user-info", config);
}

function cashout(token: string | null, data: CashoutData) {
	const config = buildConfig(token);

	return API.post("/transactions/cashout", data, config);
}

function getUserTransactions(token: string | null, data: Filters) {
	const config = buildConfig(token);

	console.log(data);

	const filters = buildQueryString(data);

	return API.get(`/transactions?${filters.where}&${filters.orderBy}`, config);
}

function buildQueryString(filters: Filters) {
	let where = "";
	let orderBy = "";

	if (filters.where !== "") {
		where = `whereFilter=${filters.where}`;
	}

	if (filters.orderBy !== "") {
		orderBy = `orderByFilter=${filters.orderBy}`;
	}

	return {
		where,
		orderBy,
	};
}

const apiService = {
	signIn,
	signUp,
	getUserInfo,
	cashout,
	getUserTransactions,
};

export default apiService;
