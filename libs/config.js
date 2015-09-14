var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './config.json' });

if(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT)
    nconf.set("port", process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT);
if( process.env.OPENSHIFT_NODEJS_IP)
    nconf.set("ip", process.env.OPENSHIFT_NODEJS_IP);
if (process.env.OPENSHIFT_MONGODB_DB_URL)
    nconf.set("mongoose:uri", process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME);

module.exports = nconf;
