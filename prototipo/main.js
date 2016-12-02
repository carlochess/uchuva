var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('./utils/logger.js');
var validator = require('./utils/validator.js');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var LocalAPIKeyStrategy = require('./utils/passport-localapi').Strategy;
var cookieParser = require('cookie-parser');
var path = require('path');
var express = require('express');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var session = require('express-session');
var config = require('./config.js');
//var tty = require('./tty/tty.js');
//var proxyvnc = require('./utils/websockify.js');
var MongoStore = require('connect-mongo')(session);

var app = express();
mongoose.Promise = require('bluebird');
app.use(express.static(path.join(__dirname, './static/')));
// parse application/json
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(expressValidator(validator));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
// validator
app.use(expressValidator(validator));

app.set('view engine', 'pug');
app.use(flash());
//app.use(morgan('common', {stream: accessLogStream}))

app.use(favicon(path.join(__dirname, 'static/favicon.ico')));
var comegalletas = cookieParser();
var sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection
});

app.use(comegalletas);
app.use(session({
    store: sessionStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalAPIKeyStrategy(
    function(apikey, done) {
        User.findOne({
            apikey: apikey
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

var routesUsers = require('./routes/index');
require('./routes/vfs/file-delete')(app);
require('./routes/vfs/file-download')(app);
require('./routes/vfs/file-edit')(app);
require('./routes/vfs/file-list')(app);
require('./routes/vfs/file')(app);
var routesConsola = require('./routes/consola')(app);
var routesDags = require('./routes/dag')(app);
var routesProgramas = require('./routes/programas')(app);
var routesBuilds = require('./routes/builds.js')(app);
var routesSubmits = require('./routes/run/submit.js')(app);
var routesRuns = require('./routes/run.js')(app);

app.use('/', routesUsers);
//app.use('/', routesFiles);
//app.use('/', routesConsola);
//app.use('/', routesProgramas);
//app.use('/', routesDags);
//app.use('/', routesRuns);
//app.use('/', routesBuilds);
//app.use('/', routesSubmits);


mongoose.connect(config.DATABASE_URI);
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function() {
    logger.info('Mongoose default connection open to ' + config.DATABASE_URI);
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
    logger.error('Mongoose default connection error: ' + err);
    process.exit(1);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
    logger.error('Mongoose default connection disconnected');
});

/* If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        logger.error('Mongoose default connection disconnected through app termination');
    });
});
*/
app.use(function(err, req, res, next) {
    logger.error('Unknown error: ' + err);
    res.status(err.status || 500);
    res.format({
      html: function() {
        res.render('500', {
            error: err
        });
      },
      json: function() {
        res.json({
          error: err
        });
      }
    });
});
var newmask = 0000;
var oldmask = process.umask(newmask);
logger.info("Changed umask from "+
  oldmask.toString(8)+" to "+newmask.toString(8));
logger.info("This process is pid "+process.pid);
logger.info("This platform is " + process.platform);
if (process.getuid) {
  logger.info("Current uid: "+process.getuid());
}
if (process.getgid) {
  logger.info("Current gid: "+process.getgid());
}
logger.info("Current directory"+process.cwd());


var server = app.listen(config.SERVER_PORT, function() {
    logger.info('The server is running in url ' + config.SERVER_HOST + ":" + config.SERVER_PORT);
});

server.on('error', function (err){
  logger.error(err);
  process.exit(0);
});
// tty.createServer({}, app, server);
//proxyvnc(server,cookieParser,sessionStore);
