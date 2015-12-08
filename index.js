var express = require('express'),
    enrouten = require('express-enrouten'),
    session = require('express-session');

var app = express(),
    port = 8080;

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

var server = app.listen(port, function(err) {
    console.log('app started. http://localhost:' + port);
});
