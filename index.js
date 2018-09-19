const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers=require('./routes/customer');
const mongoose = require('mongoose');

const genresEndPoint = '/api/genres';
const customerEndPoint='/api/customers';

app.use(express.json());

app.use(genresEndPoint, genres);
app.use(customerEndPoint,customers);

mongoose.connect('mongodb://localhost/vrent',{useNewUrlParser:true})
    .then(() => console.log('Connected to mongodb'))
    .catch((error) => console.log(error));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));