const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals=require('./routes/rentals');
const users=require('./routes/users');
const auth=require('./routes/auth');
const error=require('./middleware/error');
const mongoose = require('mongoose');
const Joi = require('joi');
const config=require('config');
const winston=require('winston');
require('winston-mongodb');
Joi.objectId=require('joi-objectid')(Joi);


const genresEndPoint = '/api/genres';
const customerEndPoint = '/api/customers';
const moviesEndPoint = '/api/movies';
const rentalsEndPoint='/api/rentals';
const userEndPoint='/api/users';
const authEndPoint='/api/auth';

app.use(express.json());

app.use(genresEndPoint, genres);
app.use(customerEndPoint, customers);
app.use(moviesEndPoint, movies);
app.use(rentalsEndPoint,rentals);
app.use(userEndPoint,users);
app.use(authEndPoint,auth);

app.use(error);

process.on('uncaughtException',(ex)=>{
    console.log('WE GOT UNCAUGHT EXCEPTION');
    winston.error(ex.message,ex);
});
//winston.add(new winston.transports.File,{filename:'logfile.log'});
//winston.add(winston.transports.MongoDB,{db:'mongodb://localhost/vrent'});

if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERORR: jwtPrivateKey not defiend');
    process.exit(1);
}
mongoose.connect('mongodb://localhost/vrent', {
        useNewUrlParser: true
    })
    .then(() => console.log('Connected to mongodb'))
    .catch((error) => console.log(error));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));