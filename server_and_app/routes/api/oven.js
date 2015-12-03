var tempProfile = require('../../temp-profile');

var getOvenState = function(req, res) {
    tempProfile.getOvenState(function(ovenState) {
        res.send({ ovenOn: ovenState });
    });
};

var startOven = function(req, res) {
    console.log(JSON.stringify(req.session));
    if(req.session && req.session.token){
        var profile = req.body.profile;
        console.log(req.body);
        console.log('Starting oven sim');
        tempProfile.runSim(profile, function(result){
            res.send(result);
        });
    }
    else
    {
        console.log('Session expired');
        res.send({error: 'Your session has expired. Please log back in.'});
    }
};

var stopOven = function(req, res) {
    tempProfile.stopSim(function(result){
        res.send(result);
    });

};

module.exports = {
    getOvenState: getOvenState,
    startOven: startOven,
    stopOven: stopOven
};
