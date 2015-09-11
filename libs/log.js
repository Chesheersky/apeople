var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение

    return new winston.Logger({
        transports : [
          new winston.transports.File({
            name: 'info-file',
            filename: 'filelog-info.log',
            level: 'info'
          }),
          new winston.transports.File({
            name: 'error-file',
            filename: 'filelog-error.log',
            level: 'error'
          })
        ]
    });
}

module.exports = getLogger;
