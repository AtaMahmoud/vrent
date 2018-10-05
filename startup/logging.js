const winston=require('winston');
require('winston-mongodb');

module.exports=function() {
    process.on('uncaughtException',(ex)=>{
        winston.error("Winstone"+ex.message,ex);
        process.exit(1);
    });
    
    process.on('unhandledRejection',(ex)=>{
        winston.error(ex.message,ex);
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
}