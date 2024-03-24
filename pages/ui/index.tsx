import React, { useEffect, useState } from 'react';
import { getMovies } from '../../src/queries/api/queries';
import { MovieDiscoverType } from '../../src/types/themoviedb/MovieTypes';
import { TMDB_MOVIES } from '../../src/queries/themoviedb/config';

export default function Home(): JSX.Element {
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
		<div>
			{loading && <p>Loading...</p>}
			<div>
				<div>
					{movies &&
						movies.map((movie: MovieDiscoverType, key: number) => (
							<div key={key}>
								<img
									src={`${TMDB_MOVIES.IMAGEURL}/w200${movie.backdrop_path}`}
									alt={'image of ' + movie.title}
								/>
								<p>{movie.title}</p>
							</div>
						))}
				</div>
				<div>
					<button onClick={clickToPreviousPage}>Previous</button>
					<p>{page}</p>
					<button onClick={clickToNextPage}>Next</button>
				</div>
			</div>
		</div>
	);
}
