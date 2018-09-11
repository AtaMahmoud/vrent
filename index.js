const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genresEndPoint = '/api/genres';
const genres = [{
        id: 1,
        genr: "Action"
    },
    {
        id: 2,
        genr: "comedy"
    },
    {
        id: 3,
        genr: "fantasy"
    },
    {
        id: 4,
        genr: "sci-fection"
    },
];

app.get(genresEndPoint, (req, res) => {
    res.send(genres);
});

app.get(`${genresEndPoint}/:id`, (req, res) => {
    const genr = genres.find(g => g.id === parseInt(req.params.id));
    if (!genr) return res.status(404).send(`the genr with id: ${req.body.id} can't be found`);

    res.send(genr);
});


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));