export default async function handler(req, res) {
    const movies = [
        {_id: 1, title: "The Batman"},
        {_id: 2, title: "The Joker"},
    ];
    res.json({status: 200, data: movies});
}
