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
var compression = require('compression');
var paginate = require('express-paginate');
var i18n = require("i18n");
var https = require('https');
var http = require('http');
var fs = require('fs');
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
app.use(compression());
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

app.use(paginate.middleware(10, 50));
app.all(function(req, res, next) {
  if (req.query.limit <= 10) req.query.limit = 10;
  next();
});

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

i18n.configure({
    locales:['es', 'en'],
    directory: __dirname + '/locales',
    updateFiles: false,
    cookie: 'lang',
    queryParameter: 'lang'
});

app.use(i18n.init);
app.disable('x-powered-by');

var routesUsers = require('./routes/index');
require('./routes/vfs/file-delete')(app);
require('./routes/vfs/file-download')(app);
require('./routes/vfs/file-edit')(app);
require('./routes/vfs/file-list')(app);
require('./routes/vfs/file')(app);
require('./routes/admin/index')(app);
require('./routes/admin/workloader')(app);
require('./routes/admin/software')(app);
require('./routes/admin/dag')(app);
require('./routes/admin/dagexe')(app);
require('./routes/admin/file')(app);
var routesConsola = require('./routes/consola')(app);
var routesDags = require('./routes/dag')(app);
var routesProgramas = require('./routes/programas')(app);
var routesBuilds = require('./routes/builds.js')(app);
var routesSubmits = require('./routes/run/submit.js')(app);
var routesRuns = require('./routes/run.js')(app);

app.use('/', routesUsers);

mongoose.connect(config.DATABASE_URI);
mongoose.connection.on('connected', function() {
    logger.info('Mongoose default connection open to ' + config.DATABASE_URI);
});
mongoose.connection.on('error', function(err) {
    logger.error('Mongoose default connection error: ' + err);
    process.exit(1);
});
mongoose.connection.on('disconnected', function() {
    logger.error('Mongoose default connection disconnected');
});

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

var options = {
   key: fs.readFileSync('keys/key.pem'),
   cert: fs.readFileSync('keys/cert.pem')
};


// openssl req -nodes -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
// openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
var server = http.createServer(app).listen(config.SERVER_PORT, function() {
    logger.info('The http server is running in url ' + config.SERVER_HOST + ":" + config.SERVER_PORT);
});
var serverhttps = https.createServer(options, app).listen(4443, function() {
    logger.info('The https server is running in url ' + config.SERVER_HOST + ":" + 4443);
});

server.on('error', function (e) {
  logger.error("An error has ocurred: ", e);
  process.exit(0);
});

serverhttps.on('error', function (e) {
  logger.error("An error has ocurred: ", e);
});
/*var server = app.listen(config.SERVER_PORT, function() {
    logger.info('The server is running in url ' + config.SERVER_HOST + ":" + config.SERVER_PORT);
});

server.on('error', function (err){
  logger.error(err);
  process.exit(0);
});*/
// tty.createServer({}, app, server);
//proxyvnc(server,cookieParser,sessionStore);
