const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
    winston.handleExceptions(new winston.transports.Console({
        colorize: true,
        prettyPrint:true
    }),
    new winston.transports.File({filename:'uncaughtExceptions.log'}));

    process.on('unhandledRejection', (ex) => {
        throw ex;
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

    winston.add(winston.transports.File, options.fileInfo);
    winston.add(winston.transports.MongoDB, options.mongoDB);
}