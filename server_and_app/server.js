var express = require('express');
var path = require('path');
var proxy = require('proxy-middleware');
var url = require('url');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('./socket-server');
var isProduction = process.env.NODE_ENV === 'production';
var spawn = require('child_process').spawn;
var config = require('./config');
var profiles = require('./profiles'); // mock profile data

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

app.get('/api/ovensim', function(req, res, next) {
    if(simInProgress) {
        res.send({error: 'There is already an oven sim in progress'});
        return;
    }

    simInProgress = true;

    // Running LED program
    var ledProgram = spawn(config.ledProgram.command,
                           config.ledProgram.args,
                           config.ledProgram.options);
    ledProgram.stdout.on('data', function(data) {
        data = data + '';
        io.emit('ledToggle', data);
    });

    var testLength = 240; // in seconds
    var interval = 1; // in seconds

    var profile = profiles.profiles.filter(function(profile) {
        return profile.name === 'Pb-free';
    });
    lines = profile[0].lines;

    for(var i = 0; i * interval  <= testLength; i++) {
        generatePoint(lines, i*interval);
    }

    setTimeout(function() {
        simInProgress = false;
    }, testLength*1000 + 5000);

    res.send({status: 'ok'});
});

function generatePoint(lines, time) {
    var errorFactor = 0.05;
    var trueTemp = getTemp(lines, time);
    var max = trueTemp * (1 + errorFactor);
    var min = trueTemp * (1 - errorFactor);
    var randTemp = Math.round(Math.floor(Math.random() * (max - min + 1)) + min);

    setTimeout(function() {
        var tempData = {
            time: time,
            temp: randTemp
        }
        io.emit('tempData', tempData);
    },time * 1000);
}

function getTemp(lines, time) {
    var line = getLine(lines, time);
    var temp = line.m * time + line.b;
    return temp;
}

function getLine(lines, time) {
    var line = null;
    for(var i = 0; i < lines.length; i++) {
        var tempLine = lines[i];
        if(time >= tempLine.start.x && time <= tempLine.stop.x) {
            line = tempLine;
            break;
        }
    }

    return line;
}

app.get('/api/profiles', function(req, res) {
   res.send(profiles);
});

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.io = io;

module.exports = app;
