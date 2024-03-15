import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/auth.context';
import Link from '@mui/material/Link';
import { Copyright } from '@mui/icons-material';

export default function Index() {
	const { user } = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (!user) {
			router.push('/ui/sign-in');
		}
	}, [user, router]);
	return (
		<Container maxWidth="sm">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" sx={{ mb: 2 }}>
					Material UI - Next.js example
				</Typography>
				<Link href="/ui/sign-in" color="secondary">
					Go to the Sign-In page
				</Link>
				<Copyright />
			</Box>
		</Container>
	);
}
