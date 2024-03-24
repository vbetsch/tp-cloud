import React, { useEffect, useState } from 'react';
import { getMovies } from '../../src/queries/api/queries';
import { MovieDiscoverType } from '../../src/types/themoviedb/MovieTypes';
import { Box, Button, ImageList, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import { TMDB_MOVIES } from '../../src/queries/themoviedb/config';
import Skeleton from '@mui/material/Skeleton';

export default function Home() {
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

	const clickToPreviousPage = () => {
		if (!loading && page > 1) {
			setPage(page - 1);
		}
	};
	const clickToNextPage = () => {
		if (!loading && page < totalPages) {
			setPage(page + 1);
		}
	};

	useEffect(() => {
		getData();
	}, [page]);

	return (
		<Box height="100vh" width="100%">
			<Box height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
				<ImageList sx={{ width: '50%', height: 800, margin: 0 }}>
					{movies.map((movie: MovieDiscoverType, key: number) =>
						loading ? (
							<ImageListItem key={key}>
								<Skeleton key={key} variant="rectangular" height="200px" />
							</ImageListItem>
						) : (
							<ImageListItem key={key}>
								<img
									src={`${TMDB_MOVIES.IMAGEURL}/w500${movie.backdrop_path}`}
									alt={movie.title}
									loading="lazy"
								/>
								<ImageListItemBar
									title={movie.title}
									subtitle={<span>Released in {movie.release_date}</span>}
									position="below"
								/>
							</ImageListItem>
						),
					)}
				</ImageList>
				<Box display="flex" alignItems="center" justifyContent="center">
					<Button onClick={clickToPreviousPage}>Previous</Button>
					<Typography>{page}</Typography>
					<Button onClick={clickToNextPage}>Next</Button>
				</Box>
			</Box>
		</Box>
	);
}
