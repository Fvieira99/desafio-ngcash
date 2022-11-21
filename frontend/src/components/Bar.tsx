import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const styles = {
	toolbar: {
		pr: "24px",
		backgroundColor: "primary.main",
		color: "#ffffff",
	},
};

export default function Bar() {
	const navigate = useNavigate();

	const { deleteToken } = useAuth();

	function handleLogout(): void {
		navigate("/signin");
		deleteToken();
	}

	return (
		<AppBar>
			<Toolbar sx={styles.toolbar}>
				<Typography
					onClick={() => navigate("/main")}
					component="h1"
					variant="h6"
					color="inherit"
					noWrap
					sx={{ flexGrow: 1, cursor: "pointer" }}
				>
					NG.CASH
				</Typography>
				<IconButton onClick={handleLogout}>
					<LogoutIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
