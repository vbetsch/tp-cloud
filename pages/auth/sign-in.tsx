import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/providers/AuthProvider';
import { AuthActionEnum } from '../../src/reducers/AuthReducer';
import { setRememberInLocalStorage } from '../../src/services/localstorage';

export enum RememberValues {
	TRUE = 'accepted',
	FALSE = 'refused',
}

export default function SignIn() {
	const defaultTheme = createTheme();
	const { dispatch } = useAuth();
	const router = useRouter();
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		try {
			const remember = formData.get('remember');
			const response = await fetch('/api/auth/signin', {
				method: 'POST',
				body: JSON.stringify({
					email: formData.get('email'),
					password: formData.get('password'),
					remember,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.status === 200) {
				const data = await response.json();
				dispatch({
					type: AuthActionEnum.LOGIN,
					payload: {
						data: data.userData,
						token: data.token,
					},
				});
				await setRememberInLocalStorage(remember ? RememberValues.TRUE : RememberValues.FALSE);
				await router.push('/auth/profile');
			} else {
				console.error('Failed to sign in : ', response);
			}
		} catch (error) {
			console.error('Error signing in:', error);
		}
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel control={<Checkbox name="remember" color="primary" />} label="Remember me" />
						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/auth/sign-up" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
