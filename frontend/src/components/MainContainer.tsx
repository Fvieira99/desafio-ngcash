import { Container } from "@mui/material";

const styles = {
	mainContent: {
		mt: 10,
		overflow: "auto",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",

		p: 0,
	},
};

interface Props {
	children: React.ReactNode;
}

export default function MainContainer({ children }: Props) {
	return (
		<Container sx={styles.mainContent} maxWidth="lg">
			{children}
		</Container>
	);
}
