var express = require('express');
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
// define the about route
router.get('/ErrorExample', function(req, res) {
  next(new Error('Random error!'));
})

module.exports = router;
