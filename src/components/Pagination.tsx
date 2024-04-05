import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export interface PaginationProperties {
	currentPage: number;
	totalPages: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	loading: boolean;
}

export default function Pagination(props: PaginationProperties): React.JSX.Element {
	const clickToPreviousPage = () => {
		if (!props.loading && props.currentPage > 1) {
			props.setPage(props.currentPage - 1);
		}
	};
	const clickToNextPage = () => {
		if (!props.loading && props.currentPage < props.totalPages) {
			props.setPage(props.currentPage + 1);
		}
	};

	return (
		<Box display="flex" alignItems="center" justifyContent="center">
			<Button onClick={clickToPreviousPage} disabled={props.loading}>
				Previous
			</Button>
			<Typography sx={{ userSelect: 'none' }}>{props.currentPage}</Typography>
			<Button onClick={clickToNextPage} disabled={props.loading}>
				Next
			</Button>
		</Box>
	);
}
