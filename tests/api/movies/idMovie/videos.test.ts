import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/movies/[idMovie]/videos';
import { NextApiRequest, NextApiResponse } from 'next';
import { getVideosOfMovie } from '../../../../src/queries/themoviedb/queries';

jest.mock('../../../../src/queries/themoviedb/queries', () => ({
	getVideosOfMovie: jest.fn(),
}));

describe('[API] /movies/{idMovie}/videos', () => {
	it('should return videos', async () => {
		const _idMovie: number = 123;
		const _results = [
			{
				id: '640cd15401432500e39b3055',
			},
		];

		(getVideosOfMovie as jest.Mock).mockResolvedValue({
			id: _idMovie,
			results: _results,
		});

		const { req, res } = createMocks({
			method: 'GET',
			query: { idMovie: _idMovie },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_results);
	});
	it('should return 404', async () => {
		const _errorStatus: number = 404;
		const _response = {
			success: false,
			status_code: 34,
			status_message: 'The resource you requested could not be found.',
		};

		(getVideosOfMovie as jest.Mock).mockResolvedValue(_response);

		const { req, res } = createMocks({
			method: 'GET',
			query: { idMovie: 41 },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(_errorStatus);
		expect(res._getJSONData()).toStrictEqual({
			status: _errorStatus,
			message: 'Cannot find videos of movie 41',
		});
	});
	it('should return 405 if method is not allowed', async () => {
		const { req, res } = createMocks({
			method: 'PUT',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(405);
		expect(res._getJSONData().error).toBe('Method Not Allowed');
	});
});
