import fetch from 'node-fetch';
import { ConfigService } from '../../src/services/config.service';

export default async function handler(req, res) {
	try {
		const url = ConfigService.themoviedb.urls.discover;
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer ' + ConfigService.themoviedb.keys.API_TOKEN,
			},
		};
		const apiResponse = await fetch(url, options)
			.then(r => r.json());
		// Vérifier si l'API a renvoyé une réponse valide
		if (apiResponse && apiResponse.results) {
			res.status(200).json({ status: 200, data: apiResponse.results });
		} else {
			throw new Error('Invalid API response');
		}
	} catch (error) {
		res.status(500).json({ status: 500, error: 'Internal Server Error' });
	}
}
