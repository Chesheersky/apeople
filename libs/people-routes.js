//todo move to controllers

var express         = require('express');
var log             = require('./log')(module);
var PeopleModel    = require('./mongoose').PeopleModel;
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
})
// define the home page route
router.get('/', function(req, res) {
    res.send('API is running');
})

router.get('/people', function(req, res) {
    return PeopleModel.find(function (err, people) {
        if (!err) {
            return res.send(people);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.post('/people', function(req, res) {
    var person = new PeopleModel({//todo adjust it to the model
        name: req.body.name,
        phone: req.body.phone,
        description: req.body.description,
      //  images: req.body.images
    });
    //persosn.images = req.body.images;

    person.save(function (err) {
        if (!err) {
            log.info("person created");
            return res.send({ status: 'OK', person:person });
        } else {
            console.log(err);
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

router.get('/people/:id', function(req, res) {
    return PeopleModel.findById(req.params.id, function (err, person) {
        if(!person) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', person:person });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.put('/people/:id', function (req, res){
    return PeopleModel.findById(req.params.id, function (err, person) {
        if(!person) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

//todo adjust to the proper model
        persosn.name = req.body.name;
        persosn.phone = req.body.phone;
        persosn.description = req.body.description;

        return persosn.save(function (err) {
            if (!err) {
                log.info("persosn updated");
                return res.send({ status: 'OK', persosn:persosn });
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

router.delete('/people/:id', function (req, res){
    return PeopleModel.findById(req.params.id, function (err, person) {
        if(!person) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return person.remove(function (err) {
            if (!err) {
                log.info("person removed");
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
