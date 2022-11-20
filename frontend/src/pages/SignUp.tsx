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
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { ThreeDots } from "react-loader-spinner";

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

export interface SignUpData {
	username: string;
	password: string;
}

const initialValue = {
	username: "",
	password: "",
};

export default function SignUp() {
	const [signUpData, setSignUpData] = useState<SignUpData>(initialValue);

	const navigate = useNavigate();

	const { isLoading, setIsLoading } = useContext(LoadingContext);

	console.log(signUpData);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setIsLoading(true);
		try {
			await apiService.signUp(signUpData);

			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "User Created!",
			}).then(() => {
				setIsLoading(false);

				navigate("/signin");
			});
		} catch (error) {
			const err = error as AxiosError;

			console.log(err);

			setSignUpData(initialValue);

			if (err.response?.status === 422) {
				Swal.fire({
					icon: "error",
					title: "Invalid Data",
					text: "Please, fill the fields correctly!",
				}).then(() => {
					setIsLoading(false);
				});
			} else {
				Swal.fire({
					icon: "error",
					title: "Something went wrong!",
					text: err.response?.data,
				}).then(() => {
					setIsLoading(false);
				});
			}
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box sx={styles.wrapper}>
				<Avatar sx={styles.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								type="text"
								inputProps={{ minLength: 3 }}
								disabled={isLoading}
								required
								fullWidth
								id="username"
								label="username"
								name="username"
								autoComplete="username"
								value={signUpData.username}
								onChange={(e) =>
									setSignUpData({
										...signUpData,
										[e.target.name]: e.target.value,
									})
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								disabled={isLoading}
								inputProps={{ pattern: "^(?=.*d)(?=.*[A-Z]).{8,}$" }}
								required
								fullWidth
								name="password"
								label="password"
								type="password"
								id="password"
								autoComplete="password"
								value={signUpData.password}
								onChange={(e) =>
									setSignUpData({
										...signUpData,
										[e.target.name]: e.target.value,
									})
								}
								helperText="Password must have at least one uppercase letter and one number!"
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
							"Sign Up"
						)}
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item onClick={() => navigate("/signin")}>
							<Typography component="span" sx={styles.link}>
								Already have an account? Sign in
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
