//todo split it!

var mongoose    = require('mongoose');
var crypto      = require('crypto');
var config      = require('./config');
var log         = require('./log')(module);

// Connect to mongodb
var connect = function () {
    var url = config.get('mongoose:uri');
    mongoose.connect(url);
};
connect();

var db = mongoose.connection;

db.once('open', function callback () {
    log.info("Connected to DB!");
});

db.on('error', function(error){
    log.error("Error loading the db - "+ error);
});

db.on('disconnected', connect);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// People
var Photo = new Schema({
    url: { type: String, required: true }
});

var Quest = new Schema({
    image: { type: ObjectId, ref: 'Photo' },
    name: { type: String, required: true },
    modified: { type: Date, default: Date.now },
    description: { type: String, required: false }
});

var Attempt = new Schema({
    quest: { type: ObjectId, ref: 'Quest' },
    success: { type: Boolean, required: true, default: false },
    entered: { type: Date, default: Date.now },
    exited: { type: Date, default: Date.now }
});

var Person = new Schema({
    name: { type: String, required: true },
    image: { type: ObjectId, ref: 'Photo' },
    phone: { type: String, required: true },
    description: { type: String, required: false },
    attempts: [Attempt],
    modified: { type: Date, default: Date.now }
});

// validation
//Person.path('title').validate(function (v) {
//    return v.length > 5 && v.length < 70;
//});

var PeopleModel = mongoose.model('Person', Person);
var QuestsModel = mongoose.model('Quest', Quest);
var PhotosModel = mongoose.model('Photo', Photo);
var AttemptsModel = mongoose.model('Attempt', Attempt);

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
module.exports.QuestsModel        = QuestsModel;
module.exports.PhotosModel        = PhotosModel;
module.exports.AttemptsModel      = AttemptsModel;
module.exports.UserModel          = UserModel;
module.exports.ClientModel        = ClientModel;
module.exports.AccessTokenModel   = AccessTokenModel;
module.exports.RefreshTokenModel  = RefreshTokenModel;
