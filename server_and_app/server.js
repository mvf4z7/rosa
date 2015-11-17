var express = require('express');
var path = require('path');
var proxy = require('proxy-middleware');
var url = require('url');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var io = require('./socket-server');
var isProduction = process.env.NODE_ENV === 'production';
var isPsuedoProduction = process.env.NODE_ENV === 'psuedoproduction';
var profiles = require('./profiles'); // mock profile data
var database = require('./database');
var tempProfile = require('./temp-profile');
var session = require('client-sessions');
var querystring = require('querystring');
var request = require('request');
var secrets = require('./secret');
var google = require('googleapis');

var redirect = 'http://' + secrets.hostname + ':8001/googleauth';
var googleOAuth2 = google.auth.OAuth2;
var googleOAuthClient = new googleOAuth2(secrets.google.id, secrets.google.secret, redirect);

var oauth2 = require('simple-oauth2')({
    clientID: secrets.github.id,
    clientSecret: secrets.github.secret,
    site: 'https://github.com/login',
    tokenPath: '/oauth/access_token'
});

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

if(isProduction || isPsuedoProduction) {
    app.use('/build', express.static(path.join(__dirname, 'build')));
} else {
    app.use('/build', proxy(url.parse('http://localhost:3001/build')));
}

app.use('/styles', express.static(path.join(__dirname, 'styles')));

app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 15 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    ephemeral: true
}));

app.get('/api/ovensim', function(req, res) {
    tempProfile.getOvenState(function(ovenState) {
        res.send({ ovenOn: ovenState });
    });
});


app.put('/api/ovensim', function(req, res) {
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
});

app.delete('/api/ovensim', function(req, res) {
    tempProfile.stopSim(function(result){
        res.send(result);
    });

});

app.get('/api/profiles', function(req, res) {
    /*
    database.getAllProfiles(function(allProfiles){
        res.send(allProfiles);
    });
    */
    res.send(profiles);
});

app.post('/api/profiles', function(req, res) {
    console.log(res.body);

    var profileName = req.body.profile.name;
    var profile = req.body.profile;
    database.createProfile(req.session.user, profileName, JSON.stringify(profile));
    res.send({status: 'it saved'});
});

function requireLogin(req, res, next){
    if(!req.session.token){
        res.sendFile(__dirname + '/login.html');
    }
    else{
        next();
    }
}

app.use(function(req, res, next) {
    if (req.session && req.session.token) {
        database.checkUser(req.session.user, function(user){
            if(user){
                req.user = user;
                req.session.user = user;  //refresh the session value
                res.locals.user = user;
                console.log('A user logged in: ', user);
                //console.log(JSON.stringify(res.locals));
                next();
            }
            else{
                req.session.reset();
                res.redirect('/');
            }
        });

    } else {
        next();
    }
});

app.post('/api/adduser', function(req, res) {
    var new_user = req.body.user;
    var priv = req.body.privilege;
    console.log('Adding user: ' + new_user + '; ' + priv + ' (' + typeof priv + ')');

    // Ensure that new_user is populated
    // Add regex to check valid email address?
    if(!new_user){
        res.send({error: 'Email address cannot be blank!'});
        return;
    }

    // Ensure that priv is an integer and an approved access level
    if(isNaN(priv) || priv != parseInt(Number(priv)) || isNaN(parseInt(priv, 10)) || priv < 0 || priv > 1){
        res.send({error: 'Could not recognize access level'});
        return;
    }

    database.getPrivilege(req.session.user, function(privilege){
        if(privilege === 1){
            //database.createUser(new_user, priv);
            res.send({});
        }
        else{
            res.send({error: 'You do not have access to add users!'});
        }
    });

});

app.get('/googlelogin', function(req, res) {
    res.redirect(google_authorization_uri);
});

app.get('/githublogin', function(req, res) {
    res.redirect(github_authorization_uri);
});

app.get('/', requireLogin, function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Authorization uri definition
var github_authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: 'http://localhost:8001/githubauth',
    scope: 'notifications,user:email',
    state: '3(#0/!~'
});

var google_authorization_uri = googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.email'
});

app.get('/googleauth', function(req, res) {
    var code = req.query.code;
    googleOAuthClient.getToken(code, function(err, tokens){
        if(!err) {
            googleOAuthClient.setCredentials(tokens);
            req.session.token = tokens.access_token;

            google.oauth2('v2').userinfo.get({userId: 'me', auth: googleOAuthClient}, function(err, result){
                if(err){
                    console.log('Error: ' + err);
                    res.redirect('/login');
                }
                else{
                    req.session.user = result.email;
                    res.redirect('/');
                }
            });
        }
        else {
            res.sendFile(__dirname + '/login.html');
        }
    });
});

// Callback service parsing the authorization token and asking for the access token
app.get('/githubauth', function (req, res) {
    var code = req.query.code;
    var token;
    oauth2.authCode.getToken({
        code: code,
        redirect_uri: 'http://localhost:8001/githubauth'
    }, saveToken);

    function saveToken(error, result) {
        if (error) {
            console.log('Access Token Error', error.message);
            res.redirect('/login');
        }
        token = oauth2.accessToken.create(result);

        var params = {
            'access_token': querystring.parse(token.token).access_token
        };

        var options = {
            url: 'https://api.github.com/user?' + querystring.stringify(params),
            headers: {
                'User-Agent': 'ROSA'
            }
        };

        request(options, function(err, resp, body){
            if(err){
                console.log('request error: ' + err);
                res.redirect('/login');
            }
            var info = JSON.parse(body);
            req.session.token = token;
            req.session.user = info.email;
            res.redirect('/');
        });

    }
});

app.get('/logout', function(req, res){
    req.session.reset();
    res.redirect('/');
});

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
});

app.io = io;

module.exports = app;
