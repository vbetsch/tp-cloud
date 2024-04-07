import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Link from 'next/link';
import { MovieDiscoverType } from '../src/types/themoviedb/MovieTypes';
import Title from '../src/components/Title';
import MovieList from '../src/components/movies/MovieList';
import Pagination from '../src/components/Pagination';
import { getMovies } from '../src/queries/api';

export default function Home(): React.JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [movies, setMovies] = useState<MovieDiscoverType[]>([]);
	const [totalPages, setTotalPages] = useState<number>(0);

	const getData = () => {
		setLoading(true);
		getMovies(page)
			.then(data => {
				if (data) {
					setMovies(data.results);
					setTotalPages(data.total_pages);
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
		<>
			<Title />
			<Box height="100vh" width="100%">
				<Box height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
					<MovieList movies={movies} loading={loading} />
					<Pagination
						currentPage={page}
						totalPages={totalPages}
						setPage={setPage}
						loading={loading}
					></Pagination>
				</Box>
			</Box>
		</>
	);
}
