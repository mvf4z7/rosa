var sqlite3 = require('sqlite3').verbose();

var file = "data.db";
var db = new sqlite3.Database(file);

var createUser = function(uname, privilege, error){
    if(uname === '' || privilege === null){
        error('username/privilege cannot be null!');
        return;
    }

    var stmt = db.prepare('INSERT INTO User(username, privilege) VALUES (?, ?)');
    stmt.run(uname, privilege, function(err){
        if(err){
            error(err);
        }
        else{
            error(null);
        }
    });
    stmt.finalize();
};

var createProfile = function(pname, profile, error){
    if(pname === ''){
        error('Profile name cannot be blank!');
        return;
    }

    var stmt = db.prepare('INSERT INTO Profile(pname, profile) VALUES (?, ?)');
    stmt.run(pname, profile, function(err){
        if(err){
            error(err);
        }
        else{
            error(null);
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

var getProfile = function(pname, profileCb){
    var json_profile = null;
    if(pname === ''){
        console.log('Profile name cannot be blank!');
        profileCb(json_profile);
        return;
    }

    var stmt = db.prepare('SELECT profile FROM Profile WHERE pname=?');
    stmt.all(pname, function(err, rows){
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

var getAllUsers = function(usersCb){
    var user_list = null;
    var stmt = db.prepare('SELECT username FROM User');
    stmt.all(function(err, rows){
        if(err){
            console.log(err);
            usersCb(user_list);
            return;
        }

        if(rows.length > 0){
            user_list = [];
            for(var i = 0; i < rows.length; i++){
                user_list.push(rows[i]['username']);
            }
            usersCb(user_list);
        }
        else{
            usersCb(user_list);
        }
    });
    stmt.finalize();
};

var removeUser = function(uname, error){
    if(uname === ''){
        error('username cannot be blank!');
        return;
    }

    var stmt = db.prepare('DELETE FROM User WHERE username=?');
    stmt.all(uname, function(err, rows){
        if(err){
            error(err);
        }
        else{
            error(null);
        }
    });
    stmt.finalize();
};

var removeProfile = function(pname, error){
    if(pname === ''){
        error('username cannot be blank!');
        return;
    }

    db.serialize(function() {
        var stmt = db.prepare('DELETE FROM History WHERE pname=?');
        stmt.all(pname, function(err, rows){
            if(err){
                error(err);
            }
        });
        stmt.finalize();

        stmt = db.prepare('DELETE FROM Profile WHERE pname=?');
        stmt.all(pname, function(err, rows){
            if(err){
                error(err);
            }
            else{
                error(null);
            }
        });
        stmt.finalize();
    });
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

// Sqlite date format is yyyy-MM-dd HH:mm:ss
var saveRun = function(pname, run, error){
    if(!pname){
        error('Profile name cannot be blank!');
        return;
    }

    // date('now')
    var stmt = db.prepare('INSERT INTO History(pname, date, profile) VALUES (?, CURRENT_TIMESTAMP, ?)');
    stmt.run(pname, run, function(err){
        if(err){
            error(err);
        }
        else{
            error(null);
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
    getAllUsers: getAllUsers,
    saveRun: saveRun,
    removeUser: removeUser,
    removeProfile: removeProfile
};
