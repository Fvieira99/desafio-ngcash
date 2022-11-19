import { createContext, useState } from "react";

interface ProviderProps {
	children: React.ReactNode;
}

interface IAuthContext {
	token: string | null;
	saveToken: (token: string) => void;
	deleteToken: () => void;
}

const initialValue = {
	token: null,
	saveToken: () => {},
	deleteToken: () => {},
};

const localStorageToken = localStorage.getItem("token");

export const AuthContext = createContext<IAuthContext>(initialValue);

export default function AuthProvider({ children }: ProviderProps) {
	const [token, setToken] = useState<string | null>(localStorageToken);

	function saveToken(token: string): void {
		setToken(token);
		localStorage.setItem("token", token);
	}

	function deleteToken(): void {
		setToken(initialValue.token);
		localStorage.removeItem("token");
	}

	return (
		<AuthContext.Provider value={{ token, saveToken, deleteToken }}>
			{children}
		</AuthContext.Provider>
	);
}
