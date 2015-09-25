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
            log.error('Internal error(%d): %s',res.statusCode,err.message);
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

var getPerson = function(res, personId, onNotFound, onDefaultError){
    return PeopleModel.findById(personId, function (err, person) {
        if(!person)
            return error(onNotFound(res));
        if (!err)
            return success(res.send({ status: 'OK', person:person }));
        else
            return error(onDefaultError(res, err));
    });
}

var notFound = function(res){
    res.statusCode = 404;
    return res.send({ error: 'Not found' });
}

var defaultError = function(res, err){
    res.statusCode = 500;
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    return res.send({ error: 'Server error' });
}

var success = function(out){
  return {
    success: true,
    resutlt: out
  }
}
var error = function(out){
  return {
    success: false,
    resutlt: out
  }
}

var createAttempt = function(req, res, onDefaultError){
  var attempt = new AttemptsModel({
      questId: req.body.questId,//todo get quest itself
      success: false,
      entered: Date.now(),
      exited: Date.now()
  });
  attempt.save(function (err) {
      if (!err) {
          log.info("entered a quest");
          return success(attempt);
      } else {
          return error(onDefaultError(res, err));
      }
  });
}

router.post('/quests:questId/personEnter:personId', function(req, res) {
    var personResult = getPerson(res, req.params.personId, notFound, defaultError);
    if(personResult.success == false)
        return personResult.resutlt;
    var person = personResult.resutlt;

    return AttemptsModel.findById(req.params.id, function (err, attempt) {
        if(!attempt) {
            var createAttemptResult = createAttempt(req, res, defaultError);
            if(createAttemptResult.success == false)
              return createAttemptResult.resutlt;
        }
        if (!err) {
          attempt.exited = Date.now();
          attempt.save(function (err) {
              if (!err) {
                  log.info("entered quest");
                  return res.send({ status: 'OK' });
              } else
                  return defaultError(res, err);
          });
        } else
            return defaultError(res, err);
    });
});

router.post('/quests:questId/personExit:personId', function(req, res) {
    var personResult = getPerson(res, req.params.personId, notFound, defaultError);
    if(personResult.success == false)
        return personResult.resutlt;
    var person = personResult.resutlt;

//todo find attempt by quest and its id
    return AttemptsModel.findById(req.params.id, function (err, attempt) {
        if(!attempt) {
            return notFound(res);
        }
        if (!err) {
          attempt.entered = Date.now();
          attempt.save(function (err) {
              if (!err) {
                  log.info("entered quest");
                  return res.send({ status: 'OK' });
              } else
                  return defaultError(res, err);
          });
        } else
            return defaultError(res, err);
    });
});

module.exports = router;
