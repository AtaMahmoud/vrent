const express = require('express');
const router = express.Router();
const {Genres,validate}=require('../models/genre');




router.get('/', async (req, res) => {
    const genres = await Genres.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const genre = await Genres.findById(req.params.id);
    if (!genre) return res.status(404).send(`the genre with id: ${req.body.id} can't be found`);

    res.send(genre);
});

router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genres({
        name: req.body.name
    });
     await genre.save();
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, {
        new: true
    });

    if (!genre) return res.status(404).send(`the genre with id: ${req.params.id} can't be found`);

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genres.findOneAndRemove(req.params.id);
    if (!genre) return res.status(404).send(`the genre with id: ${req.body.id} can't be found`);

    res.send(genre);
});


module.exports = router;