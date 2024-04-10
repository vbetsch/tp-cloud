import * as React from 'react';
import Avatar from '@mui/material/Avatar';
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
import { useState } from 'react';
import { signIn } from '../../src/queries/api/auth';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

export enum RememberValues {
	TRUE = 'accepted',
	FALSE = 'refused',
}

export default function SignIn() {
	const defaultTheme = createTheme();
	const { dispatch } = useAuth();
	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const remember: boolean = !!formData.get('remember');

		let data;
		setError(null);
		setLoading(true);
		try {
			data = await signIn({
				email: formData.get('email') as string,
				password: formData.get('password') as string,
				remember: remember,
			});
		} catch (e) {
			console.error(e);
			return;
		} finally {
			setLoading(false);
		}

		if (data.error) {
			setError(data.error);
			return;
		}
		dispatch({
			type: AuthActionEnum.LOGIN,
			payload: {
				data: data.userData,
				token: data.token,
			},
		});

		setLoading(true);
		try {
			await setRememberInLocalStorage(remember ? RememberValues.TRUE : RememberValues.FALSE);
		} catch (e) {
			console.error(e);
			return;
		} finally {
			setLoading(false);
		}

		setLoading(true);
		try {
			await router.push('/auth/profile');
		} catch (e) {
			console.error(e);
			return;
		} finally {
			setLoading(false);
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
						{error && (
							<Alert variant="filled" severity="error">
								{error}
							</Alert>
						)}
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							type="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							type="password"
							name="password"
							label="Password"
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel control={<Checkbox name="remember" color="primary" />} label="Remember me" />
						<LoadingButton
							loading={loading}
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</LoadingButton>
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
