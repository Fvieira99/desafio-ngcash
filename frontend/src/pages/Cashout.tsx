import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Swal from "sweetalert2";
import Bar from "../components/Bar";
import Form from "../components/Form";
import MainContainer from "../components/MainContainer";
import PaperBox from "../components/PaperBox";
import { LoadingContext } from "../contexts/LoadingContext";
import useAuth from "../hooks/useAuth";
import apiService from "../services/API";
import { UserData } from "./Main";
import { formatBalance } from "./Main";

export interface CashoutData {
	creditedAccountOwnerUsername: string;
	value: number;
}

const initialValue = {
	creditedAccountOwnerUsername: "",
	value: 0,
};

const styles = {
	balance: {
		"& .MuiOutlinedInput-input": {
			"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
				"-webkit-appearance": "none",
			},
		},
		width: "320px",
	},
};

export default function Cashout() {
	const { token } = useAuth();

	const [userData, setUserData] = useState<UserData | null>(null);

	const [cashoutData, setCashoutData] = useState<CashoutData>(initialValue);

	const { isLoading, setIsLoading } = useContext(LoadingContext);

	useEffect(() => {
		async function fetchData() {
			const response = await apiService.getUserInfo(token);

			setUserData(response.data);
		}

		fetchData();
	}, [token]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setIsLoading(true);

		console.log(cashoutData);

		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, I'm sure!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				await apiService.cashout(token, {
					...cashoutData,
					value: Number(cashoutData.value),
				});

				const response = await apiService.getUserInfo(token);

				const { data: newUserData } = response;

				if (newUserData.account) {
					setUserData(newUserData);
				}
			}

			setCashoutData(initialValue);
			setIsLoading(false);
		});
	};

	return (
		<Box sx={{ display: "flex" }}>
			<Bar />
			{userData ? (
				<MainContainer>
					<PaperBox>
						<Typography>{`@${userData?.username}`}</Typography>
						<Typography>
							{userData.account?.balance
								? `Current Balance: ${formatBalance(userData.account?.balance)}`
								: "Carrengando"}
						</Typography>

						<Form handleSubmit={handleSubmit}>
							<TextField
								sx={{ width: "320px" }}
								disabled={isLoading}
								required
								fullWidth
								id="username"
								label="username"
								name="creditedAccountOwnerUsername"
								autoComplete="username"
								helperText="Username of the person who is going to receive the credit!"
								value={cashoutData.creditedAccountOwnerUsername}
								onChange={(e) =>
									setCashoutData({
										...cashoutData,
										[e.target.name]: e.target.value,
									})
								}
							/>

							<TextField
								sx={styles.balance}
								disabled={isLoading}
								required
								fullWidth
								name="value"
								label="value"
								type="number"
								id="value"
								inputProps={{ min: 1 }}
								helperText="The value added counts the cents, so if you are going to transfer R$100.00, you must add 10000 in the input!"
								autoComplete="value"
								value={cashoutData.value}
								onChange={(e) =>
									setCashoutData({
										...cashoutData,
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
									"Cashout"
								)}
							</Button>
						</Form>
					</PaperBox>
				</MainContainer>
			) : (
				"Carregando"
			)}
		</Box>
	);
}
