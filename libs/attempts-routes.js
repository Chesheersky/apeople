//todo move to controllers

var express           = require('express');
var log               = require('./log')(module);
var AttemptsModel     = require('./mongoose').AttemptsModel;
var PeopleModel       = require('./mongoose').QuestsModel;
var router            = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  log.info(`Time: ${Date.now()}`);
  next();
})

router.get('/attempts', function(req, res) {
    return AttemptsModel.find(function (err, attempts) {
        if (!err) {
            return res.send(attempts);
        } else {
            res.statusCode = 500;
            log.error(`Internal error(${res.statusCode}): ${err.message}`);
            return res.send({ error: 'Server error' });
        }
    });
});

router.post('/attempts', function(req, res) {
      return QuestsModel.findById(req.body.quest, function (err, quest) {
          if(!quest) {
              res.statusCode = 404;
              return res.send({ error: 'Not found' });
          }
          if (!err) {
              var attempt = new AttemptsModel({
                  quest : req.body.quest,
                  success : req.body.success,
                  entered : req.body.entered,
                  exited : req.body.exited
              });

              attempt.save(function (err) {
                  if (!err) {
                      log.info("attempt created");
                      return res.send({ status: 'OK', attempt:attempt });
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
          } else {
              res.statusCode = 500;
              log.error(`Internal error(${res.statusCode}): ${err.message}`);
              return res.send({ error: 'Server error' });
          }
      });
});

router.get('/attempts/:id', function(req, res) {
    return AttemptsModel.findById(req.params.id, function (err, attempt) {
        if(!attempt) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', attempt:attempt });
        } else {
            res.statusCode = 500;
            log.error(`Internal error(${res.statusCode}): ${err.message}`);
            return res.send({ error: 'Server error' });
        }
    });
});

router.put('/attempts/:id', function (req, res){

      return QuestsModel.findById(req.body.quest, function (err, quest) {
          if(!quest) {
              res.statusCode = 404;
              return res.send({ error: 'Not found' });
          }
          if (!err) {
              return AttemptsModel.findById(req.params.id, function (err, attempt) {
                  if(!attempt) {
                      res.statusCode = 404;
                      return res.send({ error: 'Not found' });
                  }

                  attempt.quest = req.body.quest;
                  attempt.success = req.body.success;
                  attempt.entered = req.body.entered;
                  attempt.exited = req.body.exited;

                  return attempt.save(function (err) {
                      if (!err) {
                          log.info("attempt updated");
                          return res.send({ status: 'OK', attempt:attempt });
                      } else {
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
          } else {
              res.statusCode = 500;
              log.error(`Internal error(${res.statusCode}): ${err.message}`);
              return res.send({ error: 'Server error' });
          }
      });
});

router.delete('/attempts/:id', function (req, res){
    return AttemptsModel.findById(req.params.id, function (err, attempt) {
        if(!attempt) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return attempt.remove(function (err) {
            if (!err) {
                log.info("attempt removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error(`Internal error(${res.statusCode}): ${err.message}`);
                return res.send({ error: 'Server error' });
            }
        });
    });
});

module.exports = router;
