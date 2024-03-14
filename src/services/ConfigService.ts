export const ConfigService = {
	THEMOVIEDB: {
		BASEURL: 'https://api.themoviedb.org/3',
		URIS: {
			DISCOVER: '/discover/movie',
			MOVIE: {
				BASE_URI: '/movie',
				SUB_URIS: {
					VIDEOS: '/videos',
					RECOMMENDATIONS: '/recommendations',
				},
			},
		},
	},
};
