//todo move to controllers

var express         = require('express');
var oauth2          = require('./oauth2');
var passport        = require('passport');
var log             = require('./log')(module);
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  log.info('Time: ', Date.now());
  next();
})

router.use(passport.initialize());

require('./auth');

router.post('/oauth/token', oauth2.token);

router.get('/userInfo',
    passport.authenticate('bearer', { session: false }),
        function(req, res) {
            // req.authInfo is set using the `info` argument supplied by
            // `BearerStrategy`.  It is typically used to indicate scope of the token,
            // and used in access control checks.  For illustrative purposes, this
            // example simply returns the scope in the response.
            res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
        }
);

module.exports = router;
