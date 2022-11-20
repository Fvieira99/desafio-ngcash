import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

interface ThemeProps {
	children: React.ReactNode;
}

const themePallete = {
	BG: "#001e3c",
	MAIN: "#265D97",
	PAPER_DEFAULT: "#091E33",
	PAPER_TEXT: "#425466",
	GLOBAL_FONT: '"IBM Plex Sans", sans-serif',
	BT: "#007fff",
	BT_HOVER: "#0059b2",
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
		secondary: {
			main: themePallete.BT,
			dark: themePallete.BT_HOVER,
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
				},
			},
		},
		MuiPaper: {
			defaultProps: {
				style: {
					backgroundColor: themePallete.PAPER_DEFAULT,
					boxShadow: "none",
					color: themePallete.PAPER_TEXT,
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
