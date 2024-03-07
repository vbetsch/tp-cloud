export default async function handler(req, res) {
    const idMovie = parseInt(req.query.idMovie, 10);
    const movies = [
        {_id: 1, title: "The Batman"},
        {_id: 2, title: "The Joker"},
    ];
    switch (req.method) {
        case "POST":
            const {title} = req.body;
            const newMovie = {_id: movies.length + 1, title: title};
            movies.push(newMovie);
            res.status(201).json({status: 201, data: {movie: newMovie}});
            break;
        case "GET":
            const movie = movies.find(({_id}) => _id === idMovie);
            if (movie) {
                res.json({status: 200, data: {movie: movie}});
            } else {
                res.status(404).json({status: 404, error: "Not Found"});
            }
            break;
        default:
            res.status(405).json({status: 405, error: "Method Not Allowed"});
    }
}
