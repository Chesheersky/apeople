var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var log             = require('./libs/log')(module);
var people          = require('./libs/people-routes');
var quests          = require('./libs/quests-routes');
//var auth            = require('./libs/auth-routes');
var config          = require('./libs/config');
var app = express();

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride()); // поддержка put и delete

app.use('/api', people);
app.use('/api', quests);
//app.use('/api', auth);

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

app.set('port', config.get('port'));
app.set('ip', config.get('ip'));

log.info('%s: Trying to start server on %s:%d ...', Date(Date.now()), app.get('ip'), app.get('port'));
app.listen(app.get('port') ,app.get('ip'), function(){
    log.info('%s: Node server started on %s:%d ...', Date(Date.now()), app.get('ip'), app.get('port'));
});
