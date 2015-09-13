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

app.use('/styles', express.static(path.join(__dirname, 'styles')));

var simInProgress = false;
app.get('/api', function(req, res, next) {
    if(simInProgress) {
        res.send({error: 'There is already an oven sim in progress'});
        return;
    }

    simInProgress = true;

    var testLength = 10; // in seconds
    var interval = 1; // in seconds

    var f = function(time) {
        var min = 0;
        var max = 100;
        var randTemp = Math.floor(Math.random() * (max - min + 1)) + min;

        setTimeout(function() {
            var tempData = {
                time: time,
                temp: randTemp
            }
            io.emit('tempData', tempData);
        },time * 1000);
    }

    for(var i = 1; i * interval  <= testLength; i++) {
        f(i*interval);
    }

    setTimeout(function() {
        simInProgress = false;
    }, testLength*1000 + 5000);

    res.send({status: 'ok'});
});

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.io = io;

module.exports = app;
