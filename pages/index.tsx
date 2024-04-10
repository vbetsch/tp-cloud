import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Pagination } from '@mui/material';
import { MovieDiscoverType } from '../src/types/themoviedb/MovieTypes';
import Title from '../src/components/Title';
import MovieList from '../src/components/movies/MovieList';
import Navbar from '../src/components/Navbar';
import { getMovies } from '../src/queries/api/movies';
import AuthPage from '../src/templates/AuthPage';

export default function Home(): React.JSX.Element {
	const defaultTheme = createTheme();
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [movies, setMovies] = useState<MovieDiscoverType[]>([]);

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const getData = () => {
		setLoading(true);
		getMovies(page)
			.then(data => {
				if (data) {
					setMovies(data.results);
				} else {
					console.warn('No movies were found');
				}
			})
			.catch(e => {
				console.error(e);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		getData();
	}, [page]);

	return (
		<ThemeProvider theme={defaultTheme}>
			<AuthPage>
				<>
					<Title />
					<Navbar />
					<Box height="100vh" width="100%">
						<Box
							height="100%"
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
						>
							<MovieList movies={movies} loading={loading} />
							<Pagination count={500} onChange={handleChange} color="primary" disabled={loading} />
						</Box>
					</Box>
				</>
			</AuthPage>
		</ThemeProvider>
	);
}
