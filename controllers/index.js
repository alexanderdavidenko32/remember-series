var IndexRoute = require('./IndexRoute'),
    LoginRoute = require('./LoginRoute'),
    LogoutRoute = require('./LogoutRoute'),
    SignUpRoute = require('./SignUpRoute'),
    SeriesRoute = require('./series'),
    //ErrorsRoute = require('./errors'),
    routes;

routes = function(app) {
    app.get('/', IndexRoute);
    app.use('/login', LoginRoute);
    app.get('/logout', LogoutRoute);
    app.use('/signup', SignUpRoute);

    app.use('/series', SeriesRoute);
    //app.use('/error', ErrorsRoute);


    // TODO: 404 route
    //app.get('*', IndexRoute)
};
module.exports = routes;
