var express = require('express'),
    enrouten = require('express-enrouten');

var app = express(),
    port = 8080;

app.set('views', './public/templates');
app.set('view engine', 'jade');
app.use(enrouten({
    directory: 'controllers'
}));

var server = app.listen(port, function(err) {
    console.log('app started. http://localhost:' + port);
});
