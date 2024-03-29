import { VideoType } from '../VideoType';

export interface ResponseVideosOfMovie {
	id: number;
	results: VideoType[];
}
