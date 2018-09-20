const express = require('express');
const router = express.Router();
const {
    Movies,
    validate
} = require('../models/movie');
const {Genres}=require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movies.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(404).send(`The Movie with id: ${req.params.id} can't be found`);

    res.send(movie);
});

router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);
    
    const genre = await Genres.findById(req.body.genreId);
    if(!genre) res.status(400).send('Invalide genre');

    const reqBody = req.body;
    let movie = new Movies({
        title: reqBody.title,
        genre: {
            _id: genre._id,
            name:genre.name
        },
        numberInStocke: reqBody.numberInStocke,
        dailtRentalRate: reqBody.dailtRentalRate
    });

    movie = await movie.save();

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movies.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send(`The Movie with id: ${req.params.id} can't be found`);

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.body.genreId);
    if(!genre) res.status(400).send('Invalide genre');

    const reqBody = req.body;
    const movie = await Movies.findByIdAndUpdate(req.params.id, {
        title: reqBody.title,
        genre: {
            _id: genre._id,
            name:genre.name
        },
        numberInStocke: reqBody.numberInStocke,
        dailtRentalRate: reqBody.dailtRentalRate
    }, {
        new: true
    });
    if(!movie) return res.status(404).send(`The movie with the id: ${reqBody.id} not found`);

    res.send(movie);

});

module.exports=router;