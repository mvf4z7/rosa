var sqlite3 = require('sqlite3').verbose();

var file = "data.db";
/*
var exists = fs.existsSync(file);
if(!exists){
    fs.openSync(file, 'w');
}
*/
var db = new sqlite3.Database(file);

var createUser = function(uname, privilege){
    if(uname === '' || privilege === null){
        console.log('username/privilege cannot be null!');
        return;
    }

    var stmt = db.prepare('INSERT INTO User(username, privilege) VALUES (?, ?)');
    stmt.run(uname, privilege, function(err){
        if(err){
            console.log(err);
        }
    });
    stmt.finalize();
};

var createProfile = function(uname, pname, profile){
    if(uname === '' || pname === ''){
        console.log('username/profile name cannot be blank!');
        return;
    }

    var stmt = db.prepare('INSERT INTO Profile(pname, username, profile) VALUES (?, ?, ?)');
    stmt.run(pname, uname, profile, function(err){
        if(err){
            console.log(err);
        }
    });
    stmt.finalize();
};

var checkUser = function(uname, userCb){
    var result = null;
    if(uname === ''){
        //console.log('username/password cannot be blank!')
        userCb(result);
    }

    var stmt = db.prepare('SELECT * FROM User WHERE username=?');
    stmt.all(uname, function(err, rows){
        if(err){
            console.log(err);
            userCb(result);
        }

        if(rows.length > 0){
            result = uname;
            userCb(result);
        }
        else{
            userCb(result);
        }
    });
    stmt.finalize();
};

var getProfile = function(uname, pname, profileCb){
    var json_profile = null;
    if(uname === '' || pname === ''){
        console.log('username/profile name cannot be blank!');
        profileCb(json_profile);
        return;
    }

    var stmt = db.prepare('SELECT profile FROM Profile WHERE username=? AND pname=?');
    stmt.all(uname, pname, function(err, rows){
        if(err){
            console.log(err);
            profileCb(json_profile);
            return;
        }
        //console.log(rows);
        if(rows.length > 0){
            json_profile = JSON.parse(rows[0]['profile']);
            profileCb(json_profile);
        }
        else{
            profileCb(json_profile);
        }
    });
    stmt.finalize();
};

var getAllProfiles = function(profilesCb){
    var json_profiles = null;
    var stmt = db.prepare('SELECT profile FROM Profile');
    stmt.all(function(err, rows){
        if(err){
            console.log(err);
            profilesCb(json_profiles);
            return;
        }

        if(rows.length > 0){
            json_profiles = {'profiles': [], 'defaultProfile': JSON.parse(rows[0]['profile']).name};
            for(var i = 0; i < rows.length; i++){
                json_profiles.profiles.push(JSON.parse(rows[i]['profile']));
            }
            profilesCb(json_profiles);
        }
        else{
            profilesCb(json_profiles);
        }
    });
    stmt.finalize();
};

var getAllUserProfiles = function(uname, profilesCb){
    var json_profiles = null;
    if(uname === ''){
        console.log('username cannot be blank!');
        profilesCb(json_profiles);
        return;
    }

    var stmt = db.prepare('SELECT profile FROM Profile WHERE username=?');
    stmt.all(uname, function(err, rows){
        if(err){
            console.log(err);
            profilesCb(json_profiles);
            return;
        }

        if(rows.length > 0){
            json_profiles = {'profiles': [], 'defaultProfile': JSON.parse(rows[0]['profile']).name};
            for(var i = 0; i < rows.length; i++){
                json_profiles.profiles.push(JSON.parse(rows[i]['profile']));
            }
            profilesCb(json_profiles);
        }
        else{
            profilesCb(json_profiles);
        }
    });
    stmt.finalize();
};

var getPrivilege = function(uname, privilegeCb){
    var privilege = null;
    if(uname === ''){
        console.log('username cannot be blank!');
        privilegeCb(privilege);
        return;
    }

    var stmt = db.prepare('SELECT privilege FROM User WHERE username=?');
    stmt.all(uname, function(err, rows){
        if(err){
            console.log(err);
            privilegeCb(privilege);
            return;
        }
        //console.log(rows);
        if(rows.length > 0){
            privilege = JSON.parse(rows[0]['privilege']);
            privilegeCb(privilege);
        }
        else{
            privilegeCb(privilege);
        }
    });
    stmt.finalize();
};

//db.close();
module.exports = {
    createUser : createUser,
    createProfile : createProfile,
    checkUser : checkUser,
    getProfile : getProfile,
    getPrivilege: getPrivilege,
    getAllProfiles: getAllProfiles,
    getAllUserProfiles: getAllUserProfiles
};