//todo move to controllers

var express = require('express');
var log = require('./log')(module);
var PeopleModel = require('./mongoose').PeopleModel;
var QuestsModel = require('./mongoose').QuestsModel;
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    log.info('Time: ', Date.now());
    next();
});

router.get('/people', function (req, res) {
    return PeopleModel.find(function (err, people) {
        if (!err) {
            return res.send(people);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({error: 'Server error'});
        }
    });
});

router.post('/people', function (req, res) {
    var person = new PeopleModel({
        name: req.body.name,
        phone: req.body.phone,
        description: req.body.description,
        attempts: req.body.attempts,
        image: req.body.image
    });

    person.save(function (err) {
        if (!err) {
            log.info("person created");
            return res.send({status: 'OK', person: person});
        } else {
            log.error(err);
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({error: 'Validation error'});
            } else {
                res.statusCode = 500;
                res.send({error: 'Server error'});
            }
            log.error(`Internal error(${res.statusCode}): ${err.message}`);
        }
    });
});

router.get('/people/:id', function (req, res) {
    return PeopleModel.findById(req.params.id, function (err, person) {
        if (!person) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }
        if (!err) {
            return QuestsModel.find(function (err, quests) {
                if (!err) {
                    var copy = JSON.parse(JSON.stringify(person));
                    quests.forEach(function (quest) {
                        var attempt = copy.attempts.find(attempt=> attempt.quest == quest.id);
                        if (!attempt) {
                            var newAttempt = {
                                quest: quest,
                                success: false,
                                time: "0"
                            };
                            copy.attempts.push(newAttempt);
                        }
                        else
                            attempt.quest = quest;
                    });
                    return res.send({status: 'OK', person: copy});
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({error: 'Server error'});
                }
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({error: 'Server error'});
        }
    });
});

router.put('/people/:id', function (req, res) {
    return PeopleModel.findById(req.params.id, function (err, person) {
        if (!person) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        person.name = req.body.name;
        person.phone = req.body.phone;
        person.description = req.body.description;
        person.image = req.body.image;
        person.attempts = req.body.attempts;

        return person.save(function (err) {
            if (!err) {
                log.info("person updated");
                return res.send({status: 'OK', person: person});
            } else {
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({error: 'Validation error'});
                } else {
                    res.statusCode = 500;
                    res.send({error: 'Server error'});
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });
});

router.delete('/people/:id', function (req, res) {
    return PeopleModel.findById(req.params.id, function (err, person) {
        if (!person) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }
        return person.remove(function (err) {
            if (!err) {
                log.info("person removed");
                return res.send({status: 'OK'});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            }
        });
    });
});

module.exports = router;
