const {genreSchema} =require('./genre');
const mongoose=require('mongoose');
const Joi=require('joi');


const movieSchema= new mongoose.Schema({
    title:{
        type:String,
        minlength:5,
        maxlength:255,
        required:true,
        trim:true
    },
    genre:{
        type:genreSchema,
        required:true
    },
    numberInStocke:{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    dailytRentalRate:{
        type:Number,
        required:true,
        min:0,
        max:255
    }

});

const Movie=mongoose.model('Movie',movieSchema);

function validateMovie(movie) {
    const schema={
        title:Joi.string().min(5).max(50).required(),
        genreId:Joi.objectId().required(),
        numberInStocke:Joi.number().min(0).required(),
        dailytRentalRate:Joi.number().min(0).required()
    }
    return Joi.validate(movie,schema);
}

exports.Movie=Movie;
exports.validate=validateMovie;