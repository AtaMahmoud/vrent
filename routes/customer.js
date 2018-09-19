const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 15
    },
    isGold: {
        type: Boolean,
        default:false
    }
});

const Customer = mongoose.model('Customer', customerSchema);

router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
});
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send(`the customer with id: ${req.parms.id} can't be found`);

    res.send(customer);
});

router.post('/', async (req, res) => {

    const {
        error
    } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    res.send(customer);

});

router.put('/:id',async(req,res)=>{
    const {error}=validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer=await Customer.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        isGold: req.body.isGold
    },{new:true});

    if (!customer) return res.status(404).send(`the customer with id: ${req.params.id} can't be found`);
    res.send(customer);
});

router.delete('/:id',async(req,res)=>{
    const customer=await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send(`the customer with id: ${req.body.id} can't be found`);

    res.send(customer);
});

function validateCustomer(customer) {
    const schema = {
            name: Joi.string().min(5).max(255).required(),
            phoneNumber: Joi.string().min(11).max(15).required(),
            isGold:Joi.boolean()
        };
        return Joi.validate(customer, schema);
}

module.exports=router;