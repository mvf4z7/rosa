var io = require('./socket-server');
var config = require('./config');
var spawn = require('child_process').spawn;
var isProduction = process.env.NODE_ENV === 'production';

var generatePoint = function(lines, time) {
    var errorFactor = 0.05;
    var targetTemp = getTemp(lines, time);
    var max = targetTemp * (1 + errorFactor);
    var min = targetTemp * (1 - errorFactor);
    var randTemp = Math.round(Math.floor(Math.random() * (max - min + 1)) + min);

    var timerId = setTimeout(function() {
        var tempData = {
            time: time,
            temp: randTemp,
            target: Math.round(targetTemp)
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
var ovenControlProgram = null;
var timers = [];

var getOvenState = function(cb) {
    cb(simInProgress);
};

var runSim = function(profile, cb){
    if(simInProgress) {
        cb({error: 'There is already an oven sim in progress'});
        return;
    }

    simInProgress = true;

    io.emit('oven_start');

    if(isProduction) {
        // Run oven control code
        ovenControlProgram = spawn(config.ovenControlProgram.command,
            config.ovenControlProgram.args,
            config.ovenControlProgram.options);
        ovenControlProgram.stdout.on('data', function(data) {
            data = data + '';

            try {
                data = JSON.parse(data);
                if(data.type === 0) {
                  io.emit('tempData', data);
                } else {
                  console.log(data.msg);
                }
            } catch(e) {
                console.log('error parsing JSON: ', e);
            }
        });
    } else {
        // Send simulation data
        var testLength = 240; // in seconds
        var interval = 1; // in seconds

        for(var i = 0; i * interval  <= testLength; i++) {
            var timerId = generatePoint(profile.lines, i*interval);
            timers.push(timerId);
        }

        var timerId = setTimeout(function() {
            simInProgress = false;
            timers = [];
        }, testLength*1000 + 5000);
        timers.push(timerId);
    }

    cb({status: 'ok'});
};

var stopSim = function(cb){
    timers.forEach(function(timer) {
        clearTimeout(timer);
        console.log('timer cleared: ', timer);
    });
    timers = [];
    simInProgress = false;
    io.emit('oven_stop');

    if(ovenControlProgram) {
        ovenControlProgram.kill('SIGTERM');
        ovenControlProgram = null;
    }

    cb({status: 'ok'});
};

module.exports = {
    generatePoint : generatePoint,
    getTemp : getTemp,
    getLine : getLine,
    getOvenState: getOvenState,
    runSim : runSim,
    stopSim : stopSim
};
