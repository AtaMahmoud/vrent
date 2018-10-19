const express=require('express');
const router=express.Router();
const asyncMiddleware=require('../middleware/async');
const auth=require('../middleware/auth');
const moment=require('moment');
const Joi=require('joi');
const {Rental}=require('../models/rental');
const {Movie}=require('../models/movie');
const validate=require('../middleware/validate');

router.post('/',[auth,validate(validateReturn)],asyncMiddleware(async(req,res)=>{
    const rental=await Rental.findOne({
        'customer._id':req.body.customerId,
        'movie._id':req.body.movieId
    });

    if(!rental) return res.status(404).send('rental not found!');
    if(rental.dateReturn) return res.status(400).send('Return already processed');

    rental.dateReturn=new Date();
    const rentalDays=moment().diff(rental.dateOut,'days');
    rental.retunFee=rentalDays*rental.movie.dailytRentalRate;
    await rental.save();

    await Movie.update({_id:rental.movie._id},{
    $inc:{numberInStocke:1}});

    return res.status(200).send(rental);
}));

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(req, schema);

}

module.exports=router;