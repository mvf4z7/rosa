var express = require('express');
var path = require('path');
var proxy = require('proxy-middleware');
var url = require('url');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('./socket-server');
var isProduction = process.env.NODE_ENV === 'production';

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

if(isProduction) {
    app.use('/build', express.static(path.join(__dirname, 'build')));
} else {
    app.use('/build', proxy(url.parse('http://localhost:3001/build')));
}

app.get('/api', function(req, res, next) {
    res.send({data: 5});
});

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.io = io;

module.exports = app;
