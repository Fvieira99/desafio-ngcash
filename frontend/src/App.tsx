import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./assets/css/reset.css";
import "./assets/css/styles.css";
import ThemeConfig from "./config/theme.config";
import { LoadingProvider } from "./contexts/LoadingContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
	return (
		<ThemeConfig>
			<LoadingProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<SignUp />} />
						<Route path="/signin" element={<SignIn />} />
					</Routes>
				</BrowserRouter>
			</LoadingProvider>
		</ThemeConfig>
	);
}
