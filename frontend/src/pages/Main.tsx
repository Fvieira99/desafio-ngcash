import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import apiService from "../services/API";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const styles = {
	toolbar: {
		pr: "24px",
		backgroundColor: "primary.main",
		color: "#ffffff",
	},
	mainContent: {
		mt: 10,
		flexGrow: 1,
		overflow: "auto",
		display: "flex",
		justifyContent: "center",
	},
	paper: {
		p: 2,
		display: "flex",
		flexDirection: "column",
		height: 500,
		boxShadow: "none",
		borderRadius: "16px",
		border: 1,
		borderColor: "primary.main",
		justifyContent: "space-between",
		alignItems: "center",
	},

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

interface userData {
	username: string;
	userId: number;
	account: {
		id: number;
		balance: number;
	};
}

export default function Main() {
	const [userData, setUserData] = useState<userData | null>(null);

	const { token, deleteToken } = useContext(AuthContext);

	const navigate = useNavigate();

	if (!token) {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "You are not logged in!",
		}).then(() => {
			navigate("/signin");
		});
	}

	useEffect(() => {
		async function fetchData() {
			const response = await apiService.getUserInfo(token);

			setUserData(response.data);
		}

		fetchData();
	}, [token]);

	function handleLogout(): void {
		navigate("/signin");
		deleteToken();
	}

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar>
				<Toolbar sx={styles.toolbar}>
					<Typography
						component="h1"
						variant="h6"
						color="inherit"
						noWrap
						sx={{ flexGrow: 1 }}
					>
						NG.CASH
					</Typography>
					<IconButton>
						<LogoutIcon onClick={handleLogout} />
					</IconButton>
				</Toolbar>
			</AppBar>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					overflow: "hidden",
				}}
			>
				<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
					<Grid container sx={styles.mainContent}>
						{userData !== null ? (
							<Grid item xs={12} md={1} lg={7}>
								<Paper sx={styles.paper}>
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
								</Paper>
							</Grid>
						) : (
							"Carregando"
						)}
					</Grid>
				</Container>
			</Box>
		</Box>
	);
	function formatBalance(balance: number) {
		return `R$ ${balance / 100},00`;
	}
}
