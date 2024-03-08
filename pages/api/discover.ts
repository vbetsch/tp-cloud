import { NextApiRequest, NextApiResponse } from 'next';
import { ConfigService } from '../../services/config.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const url = ConfigService.themoviedb.baseUrl + ConfigService.themoviedb.uris.discover;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${process.env.API_TOKEN}`,
		},
	};
	const apiResponse = await fetch(url, options)
		.then(r => r.json())
		.catch(err => console.error('error:' + err));
	res.json({ status: 200, data: apiResponse.results });
}
