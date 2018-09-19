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

function validateCustomer(customer) {
    const schema = {
            name: Joi.string().min(5).max(255).required(),
            phoneNumber: Joi.string().min(11).max(15).required(),
            isGold:Joi.boolean()
        };
        return Joi.validate(customer, schema);
}

exports.Customer=Customer;
exports.validate=validateCustomer;