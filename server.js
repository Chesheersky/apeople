//todo split app and server

var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var passport        = require('passport');
var localStrategy   = require('passport-local').Strategy;
var log             = require('./libs/log')(module);
var people          = require('./libs/people-routes');
var quests          = require('./libs/quests-routes');
var attempts        = require('./libs/attempts-routes');
var auth            = require('./libs/authentication-routes');
var config          = require('./libs/config');
var User            = require('./libs/user.js');

var app = express();

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride()); // поддержка put и delete
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', people);
app.use('/api', quests);
app.use('/api', attempts);
app.use('/api', auth);

app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

app.use(function(req, res, next){
    res.status(404);
    log.error(`Not found URL: ${req.url}`);
    res.send({ error: 'Not found' });
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error(`Internal error(${res.statusCode}): ${err.message}`);
    res.send({ error: err.message });
});

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('port', config.get('port'));
app.set('ip', config.get('ip'));

log.info(`${Date.now()}: Trying to start server on ${app.get('ip')}:${app.get('port')} ...`);
app.listen(app.get('port') ,app.get('ip'), function(){
    log.info(`${Date.now()}: Node server started on ${app.get('ip')}:${app.get('port')} ...`);
});
