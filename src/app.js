var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var logger = require('./util/logger');
var connectHistoryApiFallback = require('connect-history-api-fallback');

var defaultRouter = require('./routes/index');
var transmitRouter= require('./routes/transmit');
var createTicker = require('./server/ticker').createTicker;
var checkToken = require('./server/oauth').checkToken;
var oauthRouter = require('./routes/oauth');
var localLoginRouter = require('./routes/localLogin');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO, format:':method :url :status  :response-time ms'}));

app.use('/', connectHistoryApiFallback()); // 由js控制路由，一定要写在express.static前面！！！
app.use('/', express.static(path.join(__dirname, '..', 'web')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

// app.use(function(req, res, next) {
//     const token = req.headers['authorization'];
//     if (token) {
//       res.setHeader('authorization', token.replace(/^JWT(%20)?/, 'JWT '))
//     }
//     next();
// })

// app.use('/oauth', oauthRouter);
app.use('/oauth', localLoginRouter);
// 验证token有效性
// app.use(function(req, res, next) {
//   const token = req.headers['authorization'];
//   if (!token) {
//     res.send('auth failed');
//   } else {
//     checkToken(token).then(result => {
//       if (!result || result.error) {
//         const err = createError(401)
//         res.locals.message = err.message;
//         res.locals.error = req.app.get('env') === 'development' ? err : {};
//         res.status(err.status);
//         res.render('error');
//       } else {
//         next();
//       }
//     }).catch(err => res.send(err))
//   }
// })
// http 请求
app.use('/om', defaultRouter);
app.use('/v2', transmitRouter);

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

createTicker();

module.exports = app;




