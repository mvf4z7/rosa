var database = require('../../database');

var addUser = function(req, res) {
    var new_user = req.body.user;
    var priv = req.body.privilege;

    // Regex to check if resembles valid email address
    var regex = /.+@.+\..{2,}/;
    var result = new_user.match(regex);

    // Note that a better way to check email validity is to send confirmation email
    if(!result){
        res.send({error: 'Email address does not appear to be valid'});
        return;
    }

    // Ensure that priv is an integer and an approved access level
    if(isNaN(priv) || priv != parseInt(Number(priv)) || isNaN(parseInt(priv, 10)) || priv < 0 || priv > 1){
        res.send({error: 'Could not recognize access level'});
        return;
    }

    database.getPrivilege(req.session.user, function(privilege){
        if(privilege === 1){
            database.createUser(new_user, priv, function(error){
                if(error){
                    console.log(error);
                    res.send({error: error});
                }
                else{
                    res.send({status: 'User created'});
                }
            });
        }
        else{
            res.send({error: 'You do not have access to add users!'});
        }
    });

};

var removeUser = function(req, res){
    var user = req.body.user;

    if(!user){
        console.log('Cannot remove user: ', user);
        res.send({error: 'Cannot remove blank user'});
        return;
    }

    database.getPrivilege(req.session.user, function(privilege){
        if(privilege === 1){
            database.removeUser(user, function(error){
                if(error){
                    console.log(error);
                    res.send({error: error});
                }
                else{
                    res.send({status: 'Finished removing user'});
                }
            });
        }
        else{
            res.send({error: 'You do not have access to remove users!'});
        }
    });
};

var getAllUsers = function(req, res){
    database.getAllUsers(function(users){
        if(users){
            res.send({users: users});
        }
        else{
            res.send({error: 'Error getting users'});
        }
    });
};

module.exports = {
    getAllUsers: getAllUsers,
    addUser: addUser,
    removeUser: removeUser
};