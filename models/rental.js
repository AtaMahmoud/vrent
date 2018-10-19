const mongoose = require('mongoose');
const Joi = require('joi');
const moment=require('moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phoneNumber: {
                type: String,
                minlength: 5,
                maxlength: 50,
                required: true,
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                trim: true,
                minlength: 5,
                maxlength: 255,
                required: true,
            },
            dailytRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturn: {
        type: Date
    },
    retunFee: {
        type: Number,
        min: 0
    }
});
rentalSchema.statics.lookUp = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}
rentalSchema.methods.return = function () {
    this.dateReturn = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.retunFee = rentalDays * this.movie.dailytRentalRate;
}
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;