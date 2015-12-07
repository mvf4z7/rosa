var database = require('../../database');

var getProfiles = function(req, res) {
    database.getAllProfiles(function(allProfiles){
        res.send(allProfiles);
    });
};

var addProfile = function(req, res) {
    var profileName = req.body.profile.name;
    var profile = req.body.profile;

    database.createProfile(profileName, JSON.stringify(profile), function(error){
        if(error){
            console.log(error);
            res.send({error: error});
        }
        else{
            res.send({status: 'Saved profile'});
        }
    });
};

var editProfile = function(req, res, profileName) {
    database.updateProfile(profileName, req.body.profile, function(error){
        if(error){
            console.log(error);
            res.send({error: error});
        }
        else{
            res.send({status: 'Updated profile'});
        }
    });
};

var removeProfile = function(req, res, profileName) {
    database.removeProfile(profileName, function(error){
        if(error){
            console.log(error);
            res.send({error: error});
        }
        else{
            res.send({status: 'Removed profile'});
        }
    });
};

module.exports = {
    getProfiles: getProfiles,
    addProfile: addProfile,
    editProfile: editProfile,
    removeProfile: removeProfile
};