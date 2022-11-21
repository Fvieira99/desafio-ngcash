import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./assets/css/reset.css";
import "./assets/css/styles.css";
import ThemeConfig from "./config/theme.config";
import AuthProvider from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import Cashout from "./pages/Cashout";
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Transactions from "./pages/Transactions";

export default function App() {
	return (
		<ThemeConfig>
			<AuthProvider>
				<LoadingProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<SignUp />} />
							<Route path="/signin" element={<SignIn />} />
							<Route path="/main" element={<Main />} />
							<Route path="/cashout" element={<Cashout />}></Route>
							<Route path="/transactions" element={<Transactions />}></Route>
						</Routes>
					</BrowserRouter>
				</LoadingProvider>
			</AuthProvider>
		</ThemeConfig>
	);
}
