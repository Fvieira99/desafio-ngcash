import { Button } from "@mui/material";
import { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";
import apiService from "../services/API";
import { AuthContext } from "../contexts/AuthContext";
import { AxiosResponse } from "axios";

const styles = {
	wrapper: {
		mt: 8,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		m: 1,
		bgcolor: "primary.main",
	},
	link: {
		textDecoration: "underline",
		cursor: "pointer",
	},
};

export interface SignInData {
	username: string;
	password: string;
}

const initialValue = {
	username: "",
	password: "",
};

export default function SignIn() {
	const [signInData, setSignInData] = useState<SignInData>(initialValue);

	const navigate = useNavigate();

	const { isLoading, toggleLoading } = useContext(LoadingContext);
	const { saveToken } = useContext(AuthContext);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		toggleLoading();

		try {
			const response: AxiosResponse = await apiService.signIn(signInData);

			saveToken(response.data);

			toggleLoading();

			navigate("/main");
		} catch (error) {
			console.log(error);
			toggleLoading();

			setSignInData(initialValue);
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box sx={styles.wrapper}>
				<Avatar sx={styles.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign In
				</Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								disabled={isLoading}
								required
								fullWidth
								id="username"
								label="username"
								name="username"
								autoComplete="username"
								value={signInData.username}
								onChange={(e) =>
									setSignInData({
										...signInData,
										[e.target.name]: e.target.value,
									})
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								disabled={isLoading}
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="password"
								value={signInData.password}
								onChange={(e) =>
									setSignInData({
										...signInData,
										[e.target.name]: e.target.value,
									})
								}
							/>
						</Grid>
					</Grid>
					<Button
						disabled={isLoading}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item onClick={() => navigate("/")}>
							<Typography component="span" sx={styles.link}>
								Don't have an account yet? Sign up
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
