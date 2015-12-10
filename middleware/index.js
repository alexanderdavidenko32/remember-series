var cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    enrouten = require('express-enrouten'),
    MongoStore = require('connect-mongodb-session')(session),
    checkUser = require('./check-user'),
    mongoose = require('mongoose');

module.exports = function(app) {
    var connection = mongoose.connection,
        connectionUri = 'mongodb://' + connection.host + ':' + connection.port + '/' + connection.name;
        oneMonth = 24*3600*1000*30,

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(session({
        secret: 'xOaOjw10X4KAMkgb0bVFqtzLnoWTiy9f',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: (oneMonth) },
        store: new MongoStore({
            uri: connectionUri
        })
    }));

    app.use(checkUser());
    app.use(enrouten({
        directory: '../controllers'
    }));
};
