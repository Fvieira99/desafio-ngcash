import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import apiService from "../services/API";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Bar from "../components/Bar";
import PaperBox from "../components/PaperBox";
import MainContainer from "../components/MainContainer";

const styles = {
	optionButton: {
		backgroundColor: "secondary.main",
		color: "#ffffff",
		width: "155px",
		height: "114px",

		"&:hover": {
			backgroundColor: "secondary.dark",
		},
	},

	balanceContainer: {
		display: "flex",
		flexDirection: "column",
		gap: "10px",
		alignItems: "center",
	},

	balanceText: {
		color: "secondary.main",
		fontWeight: "700",
		fontSize: "40px",
	},
};

export interface UserData {
	username: string;
	userId: number;
	account: {
		id: number;
		balance: number;
	};
}

export default function Main() {
	const [userData, setUserData] = useState<UserData | null>(null);

	const { token } = useAuth();

	const navigate = useNavigate();

	useEffect(() => {
		async function fetchData() {
			const response = await apiService.getUserInfo(token);

			setUserData(response.data);
		}

		fetchData();
	}, [token]);

	return (
		<Box>
			<Bar />
			<MainContainer>
				{userData !== null ? (
					<PaperBox>
						<h1>{`@${userData.username}`}</h1>
						<Box sx={styles.balanceContainer}>
							<Typography sx={styles.balanceText}>Balance</Typography>
							<Typography sx={styles.balanceText}>
								{formatBalance(userData.account.balance)}
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								gap: "10px",
								justifyContent: "center",
							}}
						>
							<Button
								sx={styles.optionButton}
								onClick={() => navigate("/cashout")}
							>
								Cash Out
							</Button>
							<Button
								sx={styles.optionButton}
								onClick={() => navigate("/transactions")}
							>
								Transactions
							</Button>
						</Box>
					</PaperBox>
				) : (
					"Carregando"
				)}
			</MainContainer>
		</Box>
	);
}

export function formatBalance(balance: number) {
	return `R$ ${balance / 100},00`;
}
