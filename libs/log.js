var winston = require('winston');
var path    = require('path');

function getLogger(module) {
    var label = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение
    var logDir = process.env.OPENSHIFT_LOG_DIR;

    return new winston.Logger({
        transports : [
          new winston.transports.File({
            name:       path.join(logDir, 'info-file'),
            filename:   'filelog-info.log',
            level:      'info',
            label:      label
          }),
          new winston.transports.File({
            name:       path.join(logDir, 'error-file'),
            filename:   'filelog-error.log',
            level:      'error',
            label:      label
          })
        ]
    });
}

module.exports = getLogger;
