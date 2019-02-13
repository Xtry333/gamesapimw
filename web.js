const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const userRouter = require('./web/routes/user');
const gameRouter = require('./web/routes/game');
const indexRouter = require('./web/routes/index');

const web = express();

// view engine setup
web.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/web/views/layout/',
    partialsDir: __dirname + '/web/views/partials/'
}));

web.set('views', path.join(__dirname, './web/views'));
web.set('view engine', 'hbs');

web.use(logger('dev'));
web.use(express.json());
web.use(express.urlencoded({ extended: false }));
web.use(cookieParser());
web.use(express.static(path.join(__dirname, './web/public')));

var store = new MongoDBStore({
    uri: `mongodb+srv://${process.env.MONGO_ATLAS_US}:${process.env.MONGO_ATLAS_PW}@cluster0-otcey.mongodb.net/games?retryWrites=true`,
    collection: 'siteSesssions'
});

web.use(session({
    secret: process.env.SESSION_SC,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: true,
    store: store,
    saveUninitialized: false
}));

web.use('/user', userRouter);
web.use('/game', gameRouter);
web.use('/', indexRouter);

// catch 404 and forward to error handler
web.use(function(req, res, next) {
  next(createError(404));
});

// error handler
web.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = web;
