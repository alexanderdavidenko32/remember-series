let express = require('express'),
    mongoose = require('mongoose'),

    config = require('./config/config.json'),
    middleware = require('./middleware'),

    connectionUri = `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`,

    app = express(),
    models = require('./models'),
    server;

//TODO: domain
mongoose.connect(connectionUri, { useMongoClient: true });

mongoose.Promise = global.Promise;

mongoose.set('debug', true);

app.set('views', './public/templates');
app.set('view engine', 'jade');

middleware(app);

server = app.listen(config.port, function(err) {
    console.log(`app started. http://localhost: ${config.port}`);
});
