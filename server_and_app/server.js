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
    var ledProgram = spawn('python', ['demo.py']);
    ledProgram.stdout.on('data', function(data) {
        data = data + '';
        io.emit('ledToggle', data);
    });

    var testLength = 240; // in seconds
    var interval = 1; // in seconds

    var f = function(time) {
        var errorFactor = 0.05;
        var trueTemp = getTemp(time);
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

    for(var i = 1; i * interval  <= testLength; i++) {
        f(i*interval);
    }

    setTimeout(function() {
        simInProgress = false;
    }, testLength*1000 + 5000);

    res.send({status: 'ok'});
});

var profile = [{
        start: {
            x: 0,
            y: 25
        },
        stop: {
            x: 42,
            y: 150
        },
        m: 125/42,
        b: 25
    }, {
        start: {
            x: 42,
            y: 150
        },
        stop: {
            x: 110,
            y: 220
        },
        m: 35/34,
        b: 1815/17
    }, {
        start: {
            x: 110,
            y: 220
        },
        stop: {
            x: 134,
            y: 260
        },
        m: 5/3,
        b: 110/3
    }, {
        start: {
            x: 134,
            y: 260
        },
        stop: {
            x: 143,
            y: 260
        },
        m: 0,
        b: 260
    }, {
        start: {
            x: 143,
            y: 260
        },
        stop: {
            x: 202,
            y: 150
        },
        m: -110/59,
        b: 31070/59
    }, {
        start: {
            x: 202,
            y: 150
        },
        stop: {
            x: 240,
            y: 25
        },
        m: -125/38,
        b: 15475/19
    }
]

function getTemp(time) {
    var line = getLine(time);
    var temp = line.m * time + line.b;
    return temp;
}

function getLine(time) {
    var line = null;
    for(var i = 0; i < profile.length; i++) {
        var tempLine = profile[i];
        if(time >= tempLine.start.x && time <= tempLine.stop.x) {
            line = tempLine;
            break;
        }
    }

    return line;
}


app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.io = io;

module.exports = app;
