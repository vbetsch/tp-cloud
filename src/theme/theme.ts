import { Roboto } from 'next/font/google';
import { createTheme, Theme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { NextFont } from 'next/dist/compiled/@next/font';

const roboto: NextFont = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});
// Create a theme instance.
const theme: Theme = createTheme({
	palette: {
		primary: {
			main: '#556cd6',
		},
		secondary: {
			main: '#19857b',
		},
		error: {
			main: red.A400,
		},
	},
	typography: {
		fontFamily: roboto.style.fontFamily,
	},
});
export default theme;
