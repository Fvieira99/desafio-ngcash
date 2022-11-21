import { Box } from "@mui/material";

interface Props {
	children: React.ReactNode;
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => {};
}

const styles = {
	form: {
		mt: 3,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "10px",
	},
};

export default function Form({ children, handleSubmit }: Props) {
	return (
		<Box component="form" sx={styles.form} onSubmit={handleSubmit}>
			{children}
		</Box>
	);
}
