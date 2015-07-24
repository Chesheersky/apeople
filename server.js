var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var log             = require('./libs/log')(module);
var routes          = require('./libs/people-routes');
var config          = require('./libs/config');
var app = express();


app.use('/api', routes);
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyParser()); // стандартный модуль, для парсинга JSON в запросах
app.use(methodOverride()); // поддержка put и delete
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.listen(config.get('port'), function(){
    log.info('Express server listening on port 1337');
});
