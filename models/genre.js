const Joi = require('joi');
const mongoose = require('mongoose');

const Genres = mongoose.model('Genres', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(genre, schema);

}

exports.Genres=Genres;
exports.validate=validateGenre;