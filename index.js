var express = require('express'),
    mongoose = require('mongoose'),

    config = require('./config/config.json'),
    middleware = require('./middleware'),

    connectionUri = 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.database,

    app = express();

mongoose.connect(connectionUri);

app.set('views', './public/templates');
app.set('view engine', 'jade');

middleware(app);

var server = app.listen(config.port, function(err) {
    console.log('app started. http://localhost:' + config.port);
});
