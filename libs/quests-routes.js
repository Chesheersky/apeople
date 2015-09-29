//todo move to controllers

var express         = require('express');
var log             = require('./log')(module);
var QuestsModel     = require('./mongoose').QuestsModel;
var PeopleModel     = require('./mongoose').PeopleModel;
var AttemptsModel   = require('./mongoose').AttemptsModel;
var router          = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  log.info('Time: ', Date.now());
  next();
})

router.get('/quests', function(req, res) {
    return QuestsModel.find(function (err, quests) {
        if (!err) {
            return res.send(quests);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.post('/quests', function(req, res) {
    var quest = new QuestsModel({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    });

    quest.save(function (err) {
        if (!err) {
            log.info("quest created");
            return res.send({ status: 'OK', quest:quest });
        } else {
            log.error(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error(`Internal error(${res.statusCode}): ${err.message}`);
        }
    });
});

router.get('/quests/:id', function(req, res) {
    return QuestsModel.findById(req.params.id, function (err, quest) {
        if(!quest) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', quest:quest });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.put('/quests/:id', function (req, res){
    return QuestsModel.findById(req.params.id, function (err, quest) {
        if(!quest) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        quest.name = req.body.name;
        quest.description = req.body.description;
        quest.image = req.body.image;

        return quest.save(function (err) {
            if (!err) {
                log.info("quest updated");
                return res.send({ status: 'OK', quest:quest });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

router.delete('/quests/:id', function (req, res){
    return QuestsModel.findById(req.params.id, function (err, quest) {
        if(!quest) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return quest.remove(function (err) {
            if (!err) {
                log.info("quest removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});

module.exports = router;
