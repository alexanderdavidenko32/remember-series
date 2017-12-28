let IndexRoute = require('./IndexRoute'),
    LoginRoute = require('./LoginRoute'),
    LogoutRoute = require('./LogoutRoute'),
    SignUpRoute = require('./SignUpRoute'),
    SeriesRoute = require('./series'),
    ErrorsRoute = require('./errors'),
    Error404Route = require('./errors/Error404Route'),
    routes;

routes = function(app) {
    app.get('/', IndexRoute);
    app.use('/login', LoginRoute);
    app.get('/logout', LogoutRoute);
    app.use('/signup', SignUpRoute);

    app.use('/series', SeriesRoute);
    app.use('/errors', ErrorsRoute);

    app.use('*', Error404Route)
};
module.exports = routes;
