const express=require('express');
const router=express.Router();
const asyncMiddleware=require('../middleware/async');
const auth=require('../middleware/auth');
const Joi=require('joi');
const {Rental}=require('../models/rental');
const {Movie}=require('../models/movie');
const validate=require('../middleware/validate');

router.post('/',[auth,validate(validateReturn)],asyncMiddleware(async(req,res)=>{
    const rental=await Rental.lookUp(req.body.customerId,req.body.movieId);

    if(!rental) return res.status(404).send('rental not found!');
    if(rental.dateReturn) return res.status(400).send('Return already processed');

    rental.return();
    await rental.save();

    await Movie.update({_id:rental.movie._id},{
    $inc:{numberInStocke:1}});

    return res.send(rental);
}));

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(req, schema);

}

module.exports=router;