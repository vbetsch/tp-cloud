// eslint-disable-next-line no-undef
module.exports = {
	env: {
		SWAGGER_ENABLE: 'true',
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				fs: false,
				path: false,
			};
		}
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'image.tmdb.org',
				port: '',
				pathname: '/t/p/**',
			},
		],
	},
};
