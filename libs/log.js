var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение

    return new winston.Logger({
        transports : [
          new winston.transports.File({
            name: path.join(process.env.OPENSHIFT_LOG_DIR, 'info-file'),
            filename: 'filelog-info.log',
            level: 'info',
            label:      path
          }),
          new winston.transports.File({
            name: path.join(process.env.OPENSHIFT_LOG_DIR, 'error-file'),
            filename: 'filelog-error.log',
            level: 'error',
            label:      path
          })
        ]
    });
}

module.exports = getLogger;
