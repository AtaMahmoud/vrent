const express = require('express');
const router = express.Router();
const {
    Rental,
    validate
} = require('../models/rental');
const {
    Customer
} = require('../models/customer');
const {
    Movie
} = require('../models/movie');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const auth=require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const validateRequest=require('../middleware/validate');

Fawn.init(mongoose);

router.get('/', asyncMiddleware(async (req, res) => {
    const rental = await Rental.find().sort('-dateOut');
    res.send(rental);
}));

router.post('/', [auth,validateRequest(validate)] ,asyncMiddleware(async (req, res) => {
  
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Cutomer');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');

    if (movie.numberInStocke === 0) return res.status(400).send('Movie not in Stock');

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phoneNumber: customer.phoneNumber
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailytRentalRate: movie.dailytRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {
                _id: movie._id
            }, {
                $inc: {
                    numberInStocke: -1
                }
            }).run();

        res.send(rental);
    } catch (error) {
        res.send('Something happend');
    }
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send(`The rental with the ID: ${req.params.id} was not found.`);

    res.send(rental);
}));
module.exports = router;