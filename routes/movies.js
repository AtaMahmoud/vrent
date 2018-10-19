const express = require('express');
const router = express.Router();
const {
    Movie,
    validate
} = require('../models/movie');
const {
    Genres
} = require('../models/genre');
const auth=require('../middleware/auth');
const admin=require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateRequest=require('../middleware/validate');

router.get('/', asyncMiddleware(async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send(`The Movie with id: ${req.params.id} can't be found`);

    res.send(movie);
}));

router.post('/',[auth,validateRequest(validate)] , asyncMiddleware(async (req, res) => {
   
    const genre = await Genres.findById(req.body.genreId);
    if (!genre) res.status(400).send('Invalide genre');

    const reqBody = req.body;
    const movie = new Movie({
        title: reqBody.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStocke: reqBody.numberInStocke,
        dailytRentalRate: reqBody.dailytRentalRate
    });

    await movie.save();

    res.send(movie);
}));

router.delete('/:id', [auth,admin] ,asyncMiddleware(async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send(`The Movie with id: ${req.params.id} can't be found`);

    res.send(movie);
}));

router.put('/:id',[auth,validateRequest(validate)] , asyncMiddleware(async (req, res) => {
  
    const genre = await Genres.findById(req.body.genreId);
    if (!genre) res.status(400).send('Invalide genre');

    const reqBody = req.body;
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: reqBody.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStocke: reqBody.numberInStocke,
        dailytRentalRate: reqBody.dailytRentalRate
    }, {
        new: true
    });
    if (!movie) return res.status(404).send(`The movie with the id: ${reqBody.id} not found`);

    res.send(movie);

}));

module.exports = router;