var express = require('express'),
    enrouten = require('express-enrouten'),
    session = require('express-session'),
    config = require('./config/config.json'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    MongoStore = require('connect-mongodb-session')(session),
    checkUser = require('./lib/check-user'),

    connectionUri = 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.database,

    oneMonth = 24*3600*1000*30,

    app = express();

mongoose.connect(connectionUri);

app.set('views', './public/templates');
app.set('view engine', 'jade');


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

//app.use(checkUser());
app.use(enrouten({
    directory: 'controllers'
}));


var server = app.listen(config.port, function(err) {
    console.log('app started. http://localhost:' + config.port);
});
