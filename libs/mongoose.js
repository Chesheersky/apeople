//todo split it!

var mongoose    = require('mongoose');
var crypto      = require('crypto');
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

// People
//var Images = new Schema({
//    kind: {
//        type: String,
//        enum: ['thumbnail', 'detail'],
//        required: true
//    },
//    url: { type: String, required: true }
//});
var Photo = new Schema({
    url: { type: String, required: true }
});

//var Quests = new Schema({
//    image:  { type: ObjectId, ref: Images, required: false },
//    name: { type: String, required: true }
//});

var Person = new Schema({
    name: { type: String, required: true },
    image: Photo,
    phone: { type: String, required: true },
    description: { type: String, required: false },
//    quests: [Quests],
    modified: { type: Date, default: Date.now }
});

// validation
//Person.path('title').validate(function (v) {
//    return v.length > 5 && v.length < 70;
//});

var PeopleModel = mongoose.model('Person', Person);

// User
var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

User.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        //more secure - this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

var UserModel = mongoose.model('User', User);

// Client
var Client = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

var ClientModel = mongoose.model('Client', Client);

// AccessToken
var AccessToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var AccessTokenModel = mongoose.model('AccessToken', AccessToken);

// RefreshToken
var RefreshToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var RefreshTokenModel = mongoose.model('RefreshToken', RefreshToken);

module.exports.mongoose           = mongoose;
module.exports.PeopleModel        = PeopleModel;
module.exports.UserModel          = UserModel;
module.exports.ClientModel        = ClientModel;
module.exports.AccessTokenModel   = AccessTokenModel;
module.exports.RefreshTokenModel  = RefreshTokenModel;
