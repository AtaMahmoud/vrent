const express = require('express');
const app = express();
const Joi = require('joi');
const config=require('config');
const winston=require('winston');
require('winston-mongodb');
Joi.objectId=require('joi-objectid')(Joi);

require('./startup/routes')(app);
require('./startup/db')();

process.on('uncaughtException',(ex)=>{
    winston.error("Winstone"+ex.message,ex);
    process.exit(1);
});


const options = {
    fileInfo: {
        level: 'error',
        filename: 'logfile.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: true,
    },
    mongoDB: {
        db: 'mongodb://localhost/vrent',
        collection: 'log',
        level: 'info',
        storeHost: true,
        capped: true,
    },
};

winston.add(winston.transports.File,options.fileInfo);
winston.add(winston.transports.MongoDB,options.mongoDB);

process.on('unhandledRejection',(ex)=>{
    winston.error(ex.message,ex);
    process.exit(1);
});

if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERORR: jwtPrivateKey not defiend');
    process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));