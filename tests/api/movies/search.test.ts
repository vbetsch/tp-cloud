import { describe, expect, it } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/movies/search';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSearchMovies } from '../../../src/queries/themoviedb/queries';

jest.mock('../../../src/queries/themoviedb/queries', () => ({
	getSearchMovies: jest.fn(),
}));

describe('[API] /movies/search', () => {
	it('should return results movies', async () => {
		const _response = {
			page: 1,
			results: [
				{
					adult: false,
					backdrop_path: '/87IVlclAfWL6mdicU1DDuxdwXwe.jpg',
					genre_ids: [878, 12],
					id: 693134,
					original_language: 'en',
					original_title: 'Dune: Part Two',
					overview:
						'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.',
					popularity: 736.807,
					poster_path: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
					release_date: '2024-02-27',
					title: 'Dune: Part Two',
					video: false,
					vote_average: 8.399,
					vote_count: 2007,
				},
			],
			total_pages: 1,
			total_results: 1,
		};

		(getSearchMovies as jest.Mock).mockResolvedValue(_response);

		const { req, res } = createMocks({
			method: 'GET',
			query: { query: 'Dune: Part Two' },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_response);
	});
	it('should return results movies with specified page value', async () => {
		const _response = {
			page: 7,
			results: [
				{
					adult: false,
					backdrop_path: '/6u5WHyEzphjs8wAT3JGw9Dhv180.jpg',
					genre_ids: [28, 53],
					id: 117263,
					original_language: 'en',
					original_title: 'Olympus Has Fallen',
					overview:
						'When the White House (Secret Service Code: "Olympus") is captured by a terrorist mastermind and the President is kidnapped, disgraced former Presidential guard Mike Banning finds himself trapped within the building. As the national security team scrambles to respond, they are forced to rely on Banning\'s inside knowledge to help retake the White House, save the President and avert an even bigger disaster.',
					popularity: 45.216,
					poster_path: '/ei2qjTiDpgKGuoSEntPCSAIhuvQ.jpg',
					release_date: '2013-03-20',
					title: 'Olympus Has Fallen',
					video: false,
					vote_average: 6.394,
					vote_count: 6352,
				},
				{
					adult: false,
					backdrop_path: '/sGqqnvOqJg2HDHrjtCPIlCwF4Mu.jpg',
					genre_ids: [28, 53],
					id: 423204,
					original_language: 'en',
					original_title: 'Angel Has Fallen',
					overview:
						'After a treacherous attack, Secret Service agent Mike Banning is charged with attempting to assassinate President Trumbull. Chased by his own colleagues and the FBI, Banning begins a race against the clock to clear his name.',
					popularity: 56.295,
					poster_path: '/fapXd3v9qTcNBTm39ZC4KUVQDNf.jpg',
					release_date: '2019-08-21',
					title: 'Angel Has Fallen',
					video: false,
					vote_average: 6.575,
					vote_count: 3304,
				},
				{
					adult: false,
					backdrop_path: '/gYQ30Jer6qMZSKxeDmcibueeq0T.jpg',
					genre_ids: [28, 53],
					id: 267860,
					original_language: 'en',
					original_title: 'London Has Fallen',
					overview:
						"In London for the Prime Minister's funeral, Mike Banning discovers a plot to assassinate all the attending world leaders.",
					popularity: 33.734,
					poster_path: '/korY0GInEJThWEm23MRmErQ3GqT.jpg',
					release_date: '2016-03-02',
					title: 'London Has Fallen',
					video: false,
					vote_average: 6.19,
					vote_count: 4511,
				},
				{
					adult: false,
					backdrop_path: '/grRV8O63Ee3e6NmFO2SqQfqV2nT.jpg',
					genre_ids: [18, 36, 10752],
					id: 613,
					original_language: 'de',
					original_title: 'Der Untergang',
					overview:
						'In April of 1945, Germany stands at the brink of defeat with the Russian Army closing in from the east and the Allied Expeditionary Force attacking from the west. In Berlin, capital of the Third Reich, Adolf Hitler proclaims that Germany will still achieve victory and orders his generals and advisers to fight to the last man. When the end finally does come, and Hitler lies dead by his own hand, what is left of his military must find a way to end the killing that is the Battle of Berlin, and lay down their arms in surrender.',
					popularity: 28.721,
					poster_path: '/cP1ElGjBhbZAAqmueXjHDKlSwiP.jpg',
					release_date: '2004-09-16',
					title: 'Downfall',
					video: false,
					vote_average: 7.9,
					vote_count: 3622,
				},
				{
					adult: false,
					backdrop_path: '/cYlvxDI16HtZ74L159LyKvxHyXU.jpg',
					genre_ids: [80, 18, 53],
					id: 9411,
					original_language: 'en',
					original_title: 'Fallen',
					overview:
						"Homicide detective John Hobbes witnesses the execution of serial killer Edgar Reese. Soon after the execution the killings start again, and they are very similar to Reese's style.",
					popularity: 26.909,
					poster_path: '/nEDvTB9cP2oIKY0M1ZdDvuUEJ8d.jpg',
					release_date: '1998-01-16',
					title: 'Fallen',
					video: false,
					vote_average: 6.788,
					vote_count: 1328,
				},
				{
					adult: false,
					backdrop_path: '/cS45swrlrTJijH1RblBLe8LlW2p.jpg',
					genre_ids: [80, 18, 53],
					id: 37094,
					original_language: 'en',
					original_title: 'Falling Down',
					overview:
						'An ordinary man frustrated with the various flaws he sees in society begins to psychotically and violently lash out against them.',
					popularity: 31.32,
					poster_path: '/7ujqyF96Zg3rfrsh9M0cEF0Yzqj.jpg',
					release_date: '1993-02-26',
					title: 'Falling Down',
					video: false,
					vote_average: 7.38,
					vote_count: 3453,
				},
				{
					adult: false,
					backdrop_path: '/wpTgHZCCfM3SffZvq6tCFdkkMz0.jpg',
					genre_ids: [18, 36, 10752],
					id: 17277,
					original_language: 'en',
					original_title: 'The Fall of the Roman Empire',
					overview:
						'In the year 180 A.D. Germanic tribes are about to invade the Roman empire from the north. In the midst of this crisis ailing emperor Marcus Aurelius has to make a decission about his successor between his son Commodus, who is obsessed by power, and the loyal general Gaius Livius.',
					popularity: 19.665,
					poster_path: '/ggrPUKNYFZ6ogs896ZiT0lQG9Tr.jpg',
					release_date: '1964-03-24',
					title: 'The Fall of the Roman Empire',
					video: false,
					vote_average: 6.463,
					vote_count: 176,
				},
				{
					adult: false,
					backdrop_path: '/yjisfgMwHr4jnSfiLKuMRZ0J0vl.jpg',
					genre_ids: [18, 35],
					id: 484297,
					original_language: 'en',
					original_title: 'Abe',
					overview:
						'The Israeli-Jewish side of his family calls him Avram. The Palestinian-Muslim side Ibrahim. His first-generation American agnostic lawyer parents call him Abraham. But the 12-year-old kid from Brooklyn who loves food and cooking, prefers, well, Abe. Just Abe.',
					popularity: 12.103,
					poster_path: '/76p3jexoFjSxTiChHbyDh0FwAun.jpg',
					release_date: '2020-12-24',
					title: 'Abe',
					video: false,
					vote_average: 7.0,
					vote_count: 43,
				},
				{
					adult: false,
					backdrop_path: '/vJTpt1O4ujcanoH1gqXao51b6JU.jpg',
					genre_ids: [80, 18, 53],
					id: 97614,
					original_language: 'en',
					original_title: 'Deadfall',
					overview:
						"A thriller that follows two siblings who decide to fend for themselves in the wake of a botched casino heist, and their unlikely reunion during another family's Thanksgiving celebration.",
					popularity: 20.744,
					poster_path: '/5ZM6uKhuEzWZD3xklmqKPuvq1Nj.jpg',
					release_date: '2012-11-08',
					title: 'Deadfall',
					video: false,
					vote_average: 5.96,
					vote_count: 638,
				},
				{
					adult: false,
					backdrop_path: '/qeTBrEHmaWdiBq7fFx0f65rccuW.jpg',
					genre_ids: [80, 18, 10770],
					id: 14786,
					original_language: 'en',
					original_title: 'Gotti',
					overview:
						'John Gotti, the head of a small New York mafia crew breaks a few of the old family rules. He rises to become the head of the Gambino family and the most well-known mafia boss in America. Life is good, but suspicion creeps in, and greed, rule-breaking and his high public profile all threaten to topple him.',
					popularity: 16.889,
					poster_path: '/9SVKC2ef0aqVbThlEGppRTdAiZu.jpg',
					release_date: '1996-08-17',
					title: 'Gotti',
					video: false,
					vote_average: 6.329,
					vote_count: 76,
				},
				{
					adult: false,
					backdrop_path: '/6o5a96CiiVXAVg404Y2m0UFVnSQ.jpg',
					genre_ids: [27, 18],
					id: 23439,
					original_language: 'en',
					original_title: 'House of Usher',
					overview:
						'Convinced that his family’s blood is tainted by generations of evil, Roderick Usher is hell-bent on destroying his sister Madeline’s wedding to prevent the cursed Usher bloodline from extending any further. When her fiancé, Philip Winthrop, arrives at the crumbling family estate to claim his bride, Roderick goes to ruthless lengths to keep them apart.',
					popularity: 12.42,
					poster_path: '/jEzZOrGSWpl0jKOIXoY3OnEabLQ.jpg',
					release_date: '1960-07-20',
					title: 'House of Usher',
					video: false,
					vote_average: 6.638,
					vote_count: 282,
				},
				{
					adult: false,
					backdrop_path: '/5CUdP1wrg4S6yZrDHuW3JLohYLO.jpg',
					genre_ids: [99],
					id: 913862,
					original_language: 'en',
					original_title: 'Downfall: The Case Against Boeing',
					overview:
						'Investigators reveal how Boeing’s alleged priority of profit over safety could have contributed to two catastrophic crashes within months of each other.',
					popularity: 21.774,
					poster_path: '/LRPi6b6gpDyKuveut38S8R38NI.jpg',
					release_date: '2022-02-09',
					title: 'Downfall: The Case Against Boeing',
					video: false,
					vote_average: 7.081,
					vote_count: 155,
				},
				{
					adult: false,
					backdrop_path: '/lK5e4MQ7mg8Yz5xPuxgPTKJc67w.jpg',
					genre_ids: [10770, 80, 18, 9648, 10749],
					id: 783508,
					original_language: 'en',
					original_title: 'Crossword Mysteries: Terminal Descent',
					overview:
						'After volunteering to participate in a crossword solving competition with a new supercomputer, crossword puzzle editor Tess Harper finds herself swept into the investigation of the bizarre murder of a tech CEO',
					popularity: 6.339,
					poster_path: '/6H2nRC9GaFQNpMSzY54tGnGorNr.jpg',
					release_date: '2021-02-14',
					title: 'Crossword Mysteries: Terminal Descent',
					video: false,
					vote_average: 7.321,
					vote_count: 28,
				},
				{
					adult: false,
					backdrop_path: '/rb6nReu1dXI2PrZCcVlLJ1lWaw9.jpg',
					genre_ids: [18],
					id: 554761,
					original_language: 'en',
					original_title: 'Falling',
					overview:
						'John Peterson lives with his partner Eric and their adopted daughter in Southern California. When he is visited by his aging father Willis from Los Angeles who is searching for a place to retire, their two very different worlds collide.',
					popularity: 9.208,
					poster_path: '/dvPMCVr1ILhf1q4JMGymSB8OQGl.jpg',
					release_date: '2020-10-02',
					title: 'Falling',
					video: false,
					vote_average: 6.516,
					vote_count: 182,
				},
				{
					adult: false,
					backdrop_path: '/qaZ8CXv0thtQqZGRNbHuuZ9NlgT.jpg',
					genre_ids: [18, 35, 10749],
					id: 105789,
					original_language: 'en',
					original_title: 'Going Down in La-La Land',
					overview:
						'A fresh face comes to Hollywood to act in movies but only the gay porn studios are eager to provide him with work.',
					popularity: 11.636,
					poster_path: '/tbgH8Fn3DPJzF5E7uxyjLAoPKIT.jpg',
					release_date: '2011-05-01',
					title: 'Going Down in LA-LA Land',
					video: false,
					vote_average: 5.811,
					vote_count: 45,
				},
				{
					adult: false,
					backdrop_path: '/4HaQjDaxgr2YqFqrFCfgG6S0dRf.jpg',
					genre_ids: [28, 878],
					id: 23807,
					original_language: 'it',
					original_title: '2019 - Dopo la caduta di New York',
					overview:
						'After a nuclear war society breaks down into two groups, the evil Euraks, and the rebel Federation. A mercenary named Parsifal is hired by the Federation to infiltrate New York City, which is controlled by the Euraks, to rescue the only fertile woman left on Earth.',
					popularity: 9.462,
					poster_path: '/nAGrOGYNZYReZFE5CGvCvvK30Ax.jpg',
					release_date: '1983-07-22',
					title: '2019: After the Fall of New York',
					video: false,
					vote_average: 5.5,
					vote_count: 86,
				},
				{
					adult: false,
					backdrop_path: '/wLx7DUmPu2S6jPlhyfdnEWYLlb5.jpg',
					genre_ids: [18],
					id: 28528,
					original_language: 'en',
					original_title: 'The Harder They Fall',
					overview:
						"Jobless sportswriter Eddie Willis is hired by corrupt fight promoter Nick Benko to promote his current protégé, an unknown Argentinian boxer named Toro Moreno. Although Moreno is a hulking giant, his chances for success are hampered by a powder-puff punch and a glass jaw. Exploiting Willis' reputation for integrity and standing in the boxing community, Benko arranges a series of fixed fights that propel the unsophisticated Moreno to #1 contender for the championship. The reigning champ, the sadistic Buddy Brannen, harbors resentment at the publicity Toro has been receiving and vows to viciously punish him in the ring. Eddie must now decide whether or not to tell the naive Toro the truth.",
					popularity: 13.723,
					poster_path: '/93pUA2kAOeVlyvO1EeW8YmYIapt.jpg',
					release_date: '1956-05-09',
					title: 'The Harder They Fall',
					video: false,
					vote_average: 7.044,
					vote_count: 124,
				},
				{
					adult: false,
					backdrop_path: '/tWkhRX6JiTnbOX12F7lGV2Sc4me.jpg',
					genre_ids: [10752, 35],
					id: 38364,
					original_language: 'en',
					original_title: 'The Square Peg',
					overview:
						'Norman Pitkin and Mr Grimsdale are council workmen mending the road outside an Army base when they come into conflict with the military. Shortly afterwards, they get drafted and fall into the clutches of the Sergeant they have just bested. They are sent to France to repair roads in front of the Allied advance but get captured. Pitkin takes advantage of a useful similarity to impersonate General Schreiber and manages to return a hero',
					popularity: 5.921,
					poster_path: '/8wOTPzXNo9uSZ7VPyot2U7GUhCv.jpg',
					release_date: '1958-12-04',
					title: 'The Square Peg',
					video: false,
					vote_average: 6.4,
					vote_count: 25,
				},
				{
					adult: false,
					backdrop_path: null,
					genre_ids: [10770, 12, 80, 18],
					id: 79106,
					original_language: 'en',
					original_title: 'Sherlock Holmes: Incident at Victoria Falls',
					overview:
						'King Edward asks Sherlock Holmes to perform one more task before his retirement: to safeguard the Star of Africa on a trip to Cape Town. Soon the fabled jewel is stolen and several people end up being murdered.',
					popularity: 9.916,
					poster_path: '/wLFifMWbjGnLo8Zc8hy1qu9ofs3.jpg',
					release_date: '1992-02-19',
					title: 'Sherlock Holmes: Incident at Victoria Falls',
					video: false,
					vote_average: 5.25,
					vote_count: 12,
				},
				{
					adult: false,
					backdrop_path: '/uNr0xZPuGu5ThYSmHrZ2ruptrFq.jpg',
					genre_ids: [10751, 10770],
					id: 362998,
					original_language: 'en',
					original_title: 'Golden Shoes',
					overview:
						'With his father MIA at war and his mother critical in hospital, a young boy consoles himself with dreams of playing in the youth soccer league. To do so, he must overcome the adult deception, the bullying and his solitude.',
					popularity: 6.031,
					poster_path: '/2fhUuSbh8v7UXGko4rzVyHc6yqA.jpg',
					release_date: '2015-10-06',
					title: 'Golden Shoes',
					video: false,
					vote_average: 5.939,
					vote_count: 33,
				},
			],
			total_pages: 9,
			total_results: 179,
		};

		(getSearchMovies as jest.Mock).mockResolvedValue(_response);

		const { req, res } = createMocks({
			method: 'GET',
			query: {
				query: 'chute',
				page: 7,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_response);
	});
	it('should return 404', async () => {
		const _response = {
			page: 1,
			results: [],
			total_pages: 1,
			total_results: 0,
		};

		(getSearchMovies as jest.Mock).mockResolvedValue(_response);

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(404);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			message: 'No movie was found',
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
