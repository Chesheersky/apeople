var mongoose    = require('mongoose');
var config      = require('./config');

var log         = require('./log')(module);

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Schemas
//var Images = new Schema({
//    kind: {
//        type: String,
//        enum: ['thumbnail', 'detail'],
//        required: true
//    },
//    url: { type: String, required: true }
//});

//var Quests = new Schema({
//    image:  { type: ObjectId, ref: Images, required: false },
//    name: { type: String, required: true }
//});

var Person = new Schema({
    name: { type: String, required: true },
//    photo: { type: ObjectId, ref: Images, required: false },
    phone: { type: String, required: true },
    description: { type: String, required: true },
//    quests: [Quests],
    modified: { type: Date, default: Date.now }
});

// validation
//Person.path('title').validate(function (v) {
//    return v.length > 5 && v.length < 70;
//});

var PeopleModel = mongoose.model('Person', Person);

module.exports.PeopleModel = PeopleModel;
