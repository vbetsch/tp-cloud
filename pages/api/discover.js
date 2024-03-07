import fetch from "node-fetch";
import {ConfigService} from "/services/config.service"

export default async function handler(req, res) {
    const url = ConfigService.themoviedb.urls.discover;
    //https://api.themoviedb.org/3/discover/movie
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + ConfigService.themoviedb.keys.API_TOKEN
        }
    };
    const apiResponse = await fetch(url, options)
        .then(r => r.json())
        .catch(err => console.error('error:' + err));
    res.json({status: 200, data: apiResponse.results});
}
