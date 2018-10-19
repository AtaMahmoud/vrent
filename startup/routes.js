const genresEndPoint = '/api/genres';
const customerEndPoint = '/api/customers';
const moviesEndPoint = '/api/movies';
const rentalsEndPoint = '/api/rentals';
const userEndPoint = '/api/users';
const authEndPoint = '/api/auth';
const returnsEndPoint='/api/returns';

const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns=require('../routes/returns');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use(genresEndPoint, genres);
    app.use(customerEndPoint, customers);
    app.use(moviesEndPoint, movies);
    app.use(rentalsEndPoint, rentals);
    app.use(userEndPoint, users);
    app.use(authEndPoint, auth);
    app.use(returnsEndPoint,returns);
    app.use(error);
}