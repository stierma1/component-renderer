
var winston = require("winston");
var systemConfig = require("./../config");

var logger = winston;
if(systemConfig.log){
  var loggerConfig = {level: systemConfig.log.level};
  if(systemConfig.log.location){
    loggerConfig.transports = [new (winston.transports.File)({
      filename: systemConfig.log.location,
      timestamp: function() {
          return Date.now();
    },
    formatter: function(options) {
          return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
    }
  })];
  } else {
    loggerConfig.transports = [new (winston.transports.Console)({
      timestamp: function() {
            return Date.now();
      },
      formatter: function(options) {
            return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
              (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })];
  }

  logger = new winston.Logger(loggerConfig);
}

module.exports = logger;
