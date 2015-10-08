var sqlite3 = require('sqlite3').verbose();

var file = "data.db";
/*
var exists = fs.existsSync(file);
if(!exists){
    fs.openSync(file, 'w');
}
*/
var db = new sqlite3.Database(file);

var createUser = function(uname, pass){
    if(uname === '' || pass === ''){
        console.log('username/password cannot be blank!');
        return;
    }

    var stmt = db.prepare('INSERT INTO User(username, password) VALUES (?, ?)');
    stmt.run(uname, pass, function(err){
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

var checkUserPass = function(uname, pass, userFoundCb){
    var result = false;
    if(uname === '' || pass === ''){
        //console.log('username/password cannot be blank!')
        userFoundCb(result);
    }

    var stmt = db.prepare('SELECT * FROM User WHERE username=? AND password=?');
    stmt.all(uname, pass, function(err, rows){
        if(err){
            console.log(err);
            userFoundCb(result);
        }
        //console.log(rows);
        if(rows.length > 0 && rows[0]['password'] === pass){
            console.log('password match!');
            result = true;
            userFoundCb(result);
        }
        else{
            console.log('incorrect!');
            userFoundCb(result);
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
        //console.log(rows);
        if(rows.length > 0){
            console.log('found user!');
            result = uname;
            userCb(result);
        }
        else{
            console.log('user not found!');
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
            console.log('found profile!');
            json_profile = JSON.parse(rows[0]['profile']);
            profileCb(json_profile);
        }
        else{
            console.log('no profile found!');
        }
    });
    stmt.finalize();
};

//db.close();
module.exports = {
    createUser : createUser,
    createProfile : createProfile,
    checkUserPass : checkUserPass,
    checkUser : checkUser,
    getProfile : getProfile
};