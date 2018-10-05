const express = require('express');
const app = express();
const Joi = require('joi');
const config=require('config');
Joi.objectId=require('joi-objectid')(Joi);

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();



if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERORR: jwtPrivateKey not defiend');
    process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));