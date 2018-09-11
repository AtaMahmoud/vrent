const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genresEndPoint = '/api/genres';
const genres = [{
        id: 1,
        name: "Action"
    },
    {
        id: 2,
        name: "comedy"
    },
    {
        id: 3,
        name: "fantasy"
    },
    {
        id: 4,
        name: "sci-fection"
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

app.post(genresEndPoint, (req, res) => {
    const {error}=validateGenr(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genr={
        id:genres.length+1,
        name:req.body.name
    }
    genres.push(genr);
    res.send(genr);
});

app.put(`${genresEndPoint}/:id`,(req,res)=>{
    const genr = genres.find(g => g.id === parseInt(req.params.id));
    if (!genr) return res.status(404).send(`the genr with id: ${req.body.id} can't be found`);

    const {error}=validateGenr(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    genr.name=req.body.name;
    res.send(genr);
});


function validateGenr(genr) {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(genr, schema);

}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));