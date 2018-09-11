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


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));