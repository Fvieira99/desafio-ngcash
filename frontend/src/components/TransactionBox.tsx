import { Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { formatBalance } from "../pages/Main";

export interface TransactionData {
	id: number;
	debitedAccountOwnerUsername: string;
	creditedAccountOwnerUsername: string;
	value: number;
	createdAt: Date;
}

interface Props {
	transaction: TransactionData;
}

const styles = {
	transaction: {
		display: "flex",
		flexDirection: "column",
		width: "330px;",
		height: "150px",
		boxShadow: "none",
		borderRadius: "16px",
		border: 1,
		borderColor: "primary.main",
		alignItems: "center",
		justifyContent: "center",
		mb: "20px",
		gap: "10px",
	},
};

export default function TransactionBox({ transaction }: Props) {
	return (
		<Paper sx={styles.transaction}>
			<Typography color="#ffffff">
				Credited: @{transaction.creditedAccountOwnerUsername}
			</Typography>
			<Typography color="#ffffff">
				Debited: @{transaction.debitedAccountOwnerUsername}
			</Typography>
			<Typography color="#ffffff">
				Value: R$ {formatBalance(transaction.value)}
			</Typography>
			<Typography color="#ffffff">
				{formatDate(transaction.createdAt)}
			</Typography>
		</Paper>
	);
}

function formatDate(date: Date): string {
	return dayjs(date).format("HH:mm - DD/MM/YYYY");
}
