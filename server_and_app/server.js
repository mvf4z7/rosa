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
app.get('/api', function(req, res, next) {
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
    profilePoints = profile[0].points;

    for(var i = 0; i * interval  <= testLength; i++) {
        generatePoint(profilePoints, i*interval);
    }

    setTimeout(function() {
        simInProgress = false;
    }, testLength*1000 + 5000);

    res.send({status: 'ok'});
});

function generatePoint(profilePoints, time) {
    var errorFactor = 0.05;
    var trueTemp = getTemp(profilePoints, time);
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

function getTemp(profilePoints, time) {
    var line = getLine(profilePoints, time);
    var temp = line.m * time + line.b;
    return temp;
}

function getLine(profilePoints, time) {
    var line = null;
    for(var i = 0; i < profilePoints.length; i++) {
        var tempLine = profilePoints[i];
        if(time >= tempLine.start.x && time <= tempLine.stop.x) {
            line = tempLine;
            break;
        }
    }

    return line;
}

app.get('/api/profiles', function(req, res) {
    var profiles = [{
       name: 'Pb-free',
       data: [[0, 25], [42, 150], [110, 220], [134, 260], [143, 260], [202, 150], [240, 25]]
   }];
   var defaultProfile = 'Pb-free';
   res.send({
       profiles: profiles,
       defaultProfile: defaultProfile
   });
});

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.io = io;

module.exports = app;
