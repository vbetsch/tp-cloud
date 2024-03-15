import fetch from "node-fetch";
import clientPromise from '../../../lib/mongodb';
import { ConfigService } from '../../../src/services/config.service';

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     description: Returns movie by given id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID movie
 *     responses:
 *       200:
 *         description: Success Response
 *       404:
 *         description: Movie not found
 */
export default async function handler(req, res) {
    const idMovie = parseInt(req.query.idMovie, 10);
    const url = ConfigService.themoviedb.urls.movie + '/' + idMovie;
    // 'https://api.themoviedb.org/3/movie'
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + ConfigService.themoviedb.keys.API_TOKEN
        }
    };

    const client = await clientPromise;
    const db = client.db("cluster");

    switch (req.method) {

        case "GET":
            const movie = await fetch(url, options)
                .then(r => r.json())
                .catch(err => console.error('error:' + err));

            if (!movie.id) {
                return res.status(404).json({error: "Not Found"});
            }

            const likes = await db.collection("likes").findOne({idTMDB: idMovie});

            if (likes && likes.likeCounter) {
                movie.likes = likes.likeCounter;
            } else {
                movie.likes = 0;
            }

            res.json({status: 200, data: {movie: movie}});
            break;

        default:
            res.status(405).json({error: "Method Not Allowed"});
    }
}
