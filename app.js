var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require('connect-mongo');
require("dotenv").config();



const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secretpassword',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: dbURI,
    collectionName: 'sessions',
    ttl: 60 * 60, // 1 hour
  }),
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
  }
}));


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const isAuth = (req, res, next) => {
  const publicPaths = ['/login', '/auth/google', '/auth/google/callback', '/test'];
  // Allow public routes without session
  if (publicPaths.includes(req.path)) {
    return next();
  }
  // Check session
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  next();
};



app.use(isAuth);



app.use('/', indexRouter);
app.use('/', authRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
