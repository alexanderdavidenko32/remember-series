var express = require('express'),
    enrouten = require('express-enrouten'),
    session = require('express-session'),
    config = require('./config/config.json'),
    mongoose = require('mongoose');

var app = express();

app.set('views', './public/templates');
app.set('view engine', 'jade');

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true
}));

app.use(enrouten({
    directory: 'controllers'
}));

mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.database);

var server = app.listen(config.port, function(err) {
    console.log('app started. http://localhost:' + config.port);
});
