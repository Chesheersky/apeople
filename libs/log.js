var winston = require('winston');
var path    = require('path');

function getLogger(module) {
    var label = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение
    return new winston.Logger({
        transports : [
          new winston.transports.File({
            name:       'info-file',
            filename:   'filelog-info.log',
            level:      'info',
            label:      label
          }),
          new winston.transports.File({
            name:       'debug-file',
            filename:   'filelog-debug.log',
            level:      'debug',
            label:      label
          }),
          new winston.transports.File({
            name:       'error-file',
            filename:   'filelog-error.log',
            level:      'error',
            label:      label
          })
        ]
    });
}

module.exports = getLogger;
