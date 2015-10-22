var io = require('./socket-server');
var fs = require('fs');
var spawn = require('child_process').spawn;
var config = require('./config');
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
var childPID = null;
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
        // Oven control software reads profile data from this file
        fs.writeFile('profile.json', JSON.stringify(profile));

        // Run oven control code
        ovenControlProgram = spawn(
            config.ovenControlProgram.command,
            config.ovenControlProgram.args,
            config.ovenControlProgram.options
        );

        console.log('ovenControlProgram pid:', ovenControlProgram.pid);

        ovenControlProgram.stderr.on('data', function(data) {
            console.log('ovenControlProgram stderr: ', data+'');
        })

        ovenControlProgram.stdout.on('data', function(data) {
            data = data + ''; // convert raw bytes to string

            try {
                data = JSON.parse(data);
                if(data.type === 0) {
                    io.emit('tempData', data);
                } else if(data.type=== 2) {
                    childPID = data.PID;
                    console.log('PID received: ', data.PID);
                } else {
                    console.log(data.msg);
                }
            } catch(e) {
                console.log('error parsing JSON: ', e);
            }
        });

        ovenControlProgram.on('close', function(code, signal) {
            console.log('ovenControlProgram closed');
            console.log('code: %s    signal: %s', code, signal);
            ovenControlProgram = null;
            io.emit('oven_stop');
        });

        ovenControlProgram.on('error', function(error) {
            console.log('error with ovenControlProgram: ', error);
        });


    } else {
        console.log('starting oven simulation');
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
            io.emit('oven_stop');
        }, testLength*1000 + 1000);
        timers.push(timerId);
    }

    cb({status: 'ok'});
};

var stopSim = function(cb){

    if(isProduction && ovenControlProgram) {
        console.log('ovenControlProgram PID: ', ovenControlProgram.pid);

        try {
            process.kill(childPID, 'SIGINT');
            console.log('killed child process');
            childPID = null;
        } catch(e) {
            console.log('UNABLE TO KILL CHILD PROCESS: ', childPID);
        }
        //ovenControlProgram.kill('SIGINT');
        //console.log('sent SIGINT to ovenControlProgram');
    } else {
        timers.forEach(function(timer) {
            clearTimeout(timer);
            console.log('timer cleared: ', timer);
        });
        timers = [];
        io.emit('oven_stop');
    }

    simInProgress = false;
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
