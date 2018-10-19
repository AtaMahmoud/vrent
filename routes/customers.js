const express = require('express');
const router = express.Router();
const {
    Customer,
    validate
} = require('../models/customer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateRequest=require('../middleware/validate');

router.get('/', asyncMiddleware(async (req, res) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send(`the customer with id: ${req.parms.id} can't be found`);

    res.send(customer);
}));

router.post('/', [auth, validateRequest(validate)],asyncMiddleware(async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        isGold: req.body.isGold
    });

    await customer.save();
    res.send(customer);

}));

router.put('/:id', [auth, validateRequest(validate)],asyncMiddleware(async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        isGold: req.body.isGold
    }, {
        new: true
    });

    if (!customer) return res.status(404).send(`the customer with id: ${req.params.id} can't be found`);
    res.send(customer);
}));

router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send(`the customer with id: ${req.body.id} can't be found`);

    res.send(customer);
}));


module.exports = router;