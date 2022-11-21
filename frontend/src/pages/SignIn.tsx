import {
	Button,
	Avatar,
	TextField,
	Box,
	Grid,
	Typography,
	Container,
} from "@mui/material";
import { useState, useContext, useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";
import apiService from "../services/API";
import { AuthContext } from "../contexts/AuthContext";
import { AxiosError, AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";
import Form from "../components/Form";

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

	const { isLoading, setIsLoading } = useContext(LoadingContext);
	const { saveToken, token } = useContext(AuthContext);

	useEffect(() => {
		if (token) {
			navigate("/main");
		}
	}, [token]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setIsLoading(true);

		try {
			const response: AxiosResponse = await apiService.signIn(signInData);

			saveToken(response.data);

			setIsLoading(false);

			navigate("/main");
		} catch (error) {
			const err = error as AxiosError;

			setSignInData(initialValue);

			Swal.fire({
				icon: "error",
				title: "Something went wrong!",
				text: err.response?.data,
			}).then(() => {
				setIsLoading(false);
			});
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
				<Form handleSubmit={handleSubmit}>
					<TextField
						sx={{ width: "345px" }}
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

					<TextField
						sx={{ width: "345px" }}
						disabled={isLoading}
						required
						fullWidth
						name="password"
						label="password"
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

					<Button
						disabled={isLoading}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						{isLoading ? (
							<ThreeDots
								height="20"
								width="30"
								radius="15"
								color="#ffffff"
								ariaLabel="three-dots-loading"
								wrapperStyle={{}}
								visible={true}
							/>
						) : (
							"Sign In"
						)}
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item onClick={() => navigate("/")}>
							<Typography component="span" sx={styles.link}>
								Don't have an account yet? Sign up
							</Typography>
						</Grid>
					</Grid>
				</Form>
			</Box>
		</Container>
	);
}
