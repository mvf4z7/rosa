var io = require('./socket-server');
var config = require('./config');
var spawn = require('child_process').spawn;

var generatePoint = function(lines, time) {
    var errorFactor = 0.05;
    var trueTemp = getTemp(lines, time);
    var max = trueTemp * (1 + errorFactor);
    var min = trueTemp * (1 - errorFactor);
    var randTemp = Math.round(Math.floor(Math.random() * (max - min + 1)) + min);

    var timerId = setTimeout(function() {
        var tempData = {
            time: time,
            temp: randTemp
        };
        io.emit('tempData', tempData);
    },time * 1000);

    return timerId;
};

var getTemp = function(lines, time) {
    var line = getLine(lines, time);
    var temp = line.m * time + line.b;
    return temp;
};

var getLine = function(lines, time) {
    var line = null;
    for(var i = 0; i < lines.length; i++) {
        var tempLine = lines[i];
        if(time >= tempLine.start.x && time <= tempLine.stop.x) {
            line = tempLine;
            break;
        }
    }

    return line;
};

var simInProgress = false;
var ledProgram = null;
var timers = [];
var runSim = function(profile, cb){
    if(simInProgress) {
        cb({error: 'There is already an oven sim in progress'});
        return;
    }

    simInProgress = true;

    io.emit('oven_start');

    // Running LED program
    ledProgram = spawn(config.ledProgram.command,
        config.ledProgram.args,
        config.ledProgram.options);
    ledProgram.stdout.on('data', function(data) {
        data = data + '';
        io.emit('ledToggle', data);
    });

    var testLength = 240; // in seconds
    var interval = 1; // in seconds

    for(var i = 0; i * interval  <= testLength; i++) {
        var timerId = generatePoint(profile.lines, i*interval);
        timers.push(timerId);
    }

    setTimeout(function() {
        simInProgress = false;
        timers = [];
    }, testLength*1000 + 5000);

    cb({status: 'ok'});
};

var stopSim = function(cb){
    timers.forEach(function(timer) {
        clearTimeout(timer);
        console.log('timer cleared: ', timer);
    });
    timers = [];
    simInProgress = false;

    if(ledProgram) {
        ledProgram.kill('SIGTERM');
    }

    cb({status: 'ok'});
};

module.exports = {
    generatePoint : generatePoint,
    getTemp : getTemp,
    getLine : getLine,
    runSim : runSim,
    stopSim : stopSim
};
