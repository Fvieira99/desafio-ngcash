import { Paper } from "@mui/material";

const styles = {
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
};

interface Props {
	children: React.ReactNode;
}

export default function PaperBox({ children }: Props) {
	return <Paper sx={styles.paper}>{children}</Paper>;
}
