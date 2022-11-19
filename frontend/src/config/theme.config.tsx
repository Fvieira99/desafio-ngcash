import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

interface ThemeProps {
	children: React.ReactNode;
}

const themePallete = {
	BG: "#001e3c",
	MAIN: "#265D97",
	BT_DEFAULT: "#265D97",
	GLOBAL_FONT: '"IBM Plex Sans", sans-serif',
};

const theme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: themePallete.BG,
		},
		primary: {
			main: themePallete.MAIN,
		},
	},
	typography: {
		fontFamily: themePallete.GLOBAL_FONT,
	},
	components: {
		MuiButton: {
			defaultProps: {
				style: {
					textTransform: "none",
					boxShadow: "none",
					backgroundColor: themePallete.MAIN,
				},
			},
		},
	},
});

const ThemeConfig: React.FC<ThemeProps> = ({ children }) => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};

export default ThemeConfig;
