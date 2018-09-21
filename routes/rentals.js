const express=require('express');
const router=express.Router();
const {Rental,validate}=require('../models/rental');
const {Customer}=require('../models/customer');
const {Movie}=require('../models/movie');

router.get('/',async (req,res)=>{
    const rental=await Rental.find().sort('-dateOut');
    res.send(rental);
});

router.post('/',async(req,res)=>{
    const {error}=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer=await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid Cutomer');

    const movie=await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie');

    if(movie.numberInStocke===0) return res.status(400).send('Movie not in Stock');

    let rental=new Rental({
        customer:{
           _id:customer._id,
           name:customer.name,
           isGold:customer.isGold,
           phoneNumber:customer.phoneNumber
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailytRentalRate:movie.dailytRentalRate
        }
    });

    rental=await rental.save();

    movie.numberInStocke--;
    movie.save();

    res.send(rental);
});

router.get('/:id',async(req,res)=>{
    const rental=await Rental.findById(req.params.id);
    if(!rental) return res.status(404).send(`The rental with the ID: ${req.params.id} was not found.`);

    res.send(rental);
});
module.exports=router;