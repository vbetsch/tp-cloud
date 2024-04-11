import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signUp } from '../../src/queries/api/auth';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import NavbarPage from '../../src/templates/NavbarPage';
import { useAuth } from '../../src/providers/AuthProvider';
import { AuthActionEnum } from '../../src/reducers/AuthReducer';

export default function SignIn() {
	const defaultTheme = createTheme();
	const router = useRouter();
	const { dispatch } = useAuth();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		let data;
		setError(null);
		setLoading(true);
		try {
			data = await signUp({
				email: formData.get('email') as string,
				password: formData.get('password') as string,
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
			type: AuthActionEnum.SET_OPEN_SNACKBAR,
			payload: true,
		});

		setLoading(true);
		try {
			await router.push('/auth/sign-in');
		} catch (e) {
			console.error(e);
			return;
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<NavbarPage title={'Sign-Up'}>
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
							Sign up
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
							<LoadingButton
								loading={loading}
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign Up
							</LoadingButton>
							<Grid container>
								{/*<Grid item xs>*/}
								{/*	<Link href="#" variant="body2">*/}
								{/*		Forgot password?*/}
								{/*	</Link>*/}
								{/*</Grid>*/}
								<Grid item>
									<Link href="/auth/sign-in" variant="body2">
										{'Already an account? Sign In'}
									</Link>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Container>
			</NavbarPage>
		</ThemeProvider>
	);
}
