import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/movies/[idMovie]';

jest.mock('../../lib/mongodb', () => ({
	__esModule: true,
	default: {
		db: jest.fn(() => ({
			collection: jest.fn(() => ({
				findOne: jest.fn(async () => ({ idTMDB: 123, likeCounter: 5 })),
			})),
		})),
	},
}));

describe('[API HANDLER] Movie', () => {
	it('should return movie', async () => {
		const { req, res } = createMocks({
			method: 'GET',
			query: { idMovie: 123 },
		});

		await handler(req, res);

		expect(res._getStatusCode()).toBe(200);
		expect(res._getJSONData().data.movie.id).toBeDefined();
	});
	it('should return 404', async () => {
		const { req, res } = createMocks({
			method: 'GET',
			query: { idMovie: 41 },
		});

		await handler(req, res);

		expect(res._getStatusCode()).toBe(404);
		expect(res._getJSONData().error).toBe('Not Found');
	});
	it('should return 405 if method is not allowed', async () => {
		const { req, res } = createMocks({
			method: 'PUT',
		});

		await handler(req, res);

		expect(res._getStatusCode()).toBe(405);
		expect(res._getJSONData().error).toBe('Method Not Allowed');
	});
});
