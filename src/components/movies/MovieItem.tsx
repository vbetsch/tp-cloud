import React from 'react';
import { ImageListItem, ImageListItemBar } from '@mui/material';
import Image from 'next/image';

export interface MoviesItemProperties {
	title: string;
	releaseDate: Date;
	imagePath: string;
	imageWidth: number;
	imageHeight: number;
}

export default function MovieItem(props: MoviesItemProperties): React.JSX.Element {
	return (
		<ImageListItem>
			<Image
				src={props.imagePath}
				alt={props.title}
				loading="lazy"
				width={props.imageWidth}
				height={props.imageHeight}
			/>
			<ImageListItemBar title={props.title} subtitle={`Released in ${props.releaseDate}`} position="below" />
		</ImageListItem>
	);
}
