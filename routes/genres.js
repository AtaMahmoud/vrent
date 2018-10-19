const express = require('express');
const router = express.Router();
const {Genres,validate}=require('../models/genre');
const auth=require('../middleware/auth');
const admin=require('../middleware/admin');
const asyncMiddleware=require('../middleware/async');
const validObjectId=require('../middleware/validateObjectId');
const validate=require('../middleware/validate');

router.get('/', asyncMiddleware(async (req, res) => {
    const genres = await Genres.find().sort('name');
    res.send(genres);
}));

router.get('/:id',validObjectId, asyncMiddleware(async (req, res) => {  
    const genre = await Genres.findById(req.params.id);
    if (!genre) return res.status(404).send(`the genre with id: ${req.body.id} can't be found`);

    res.send(genre);
}));

router.post('/',[auth,validate(validate)] ,asyncMiddleware(async (req, res) => {
  

    const genre = new Genres({
        name: req.body.name
    });
     await genre.save();
    res.send(genre);
}));

router.put('/:id', [auth,validObjectId,validate] ,asyncMiddleware(async (req, res) => {
    const genre = await Genres.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, {
        new: true
    });

    if (!genre) return res.status(404).send(`the genre with id: ${req.params.id} can't be found`);

    res.send(genre);
}));

router.delete('/:id', [auth,admin,validObjectId] ,asyncMiddleware(async (req, res) => {
    const genre = await Genres.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send(`the genre with id: ${req.body.id} can't be found`);

    res.send(genre);
}));


module.exports = router;