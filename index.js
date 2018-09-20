const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const mongoose = require('mongoose');

const genresEndPoint = '/api/genres';
const customerEndPoint = '/api/customers';
const moviesEndPoint = '/api/movies';

app.use(express.json());

app.use(genresEndPoint, genres);
app.use(customerEndPoint, customers);
app.use(moviesEndPoint, movies);

mongoose.connect('mongodb://localhost/vrent', {
        useNewUrlParser: true
    })
    .then(() => console.log('Connected to mongodb'))
    .catch((error) => console.log(error));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));