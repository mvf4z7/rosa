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
var profiles = require('./profiles'); // mock profile data
//var database = require('./database');
var tempProfile = require('./temp-profile');
var session = require('client-sessions');
var querystring = require('querystring');
var request = require('request');
var secrets = require('./secret');
var google = require('googleapis');

var redirect = 'http://localhost:8001/googleauth';
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

if(isProduction) {
    app.use('/build', express.static(path.join(__dirname, 'build')));
} else {
    app.use('/build', proxy(url.parse('http://localhost:3001/build')));
}

app.use('/styles', express.static(path.join(__dirname, 'styles')));

app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
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
    var profile = req.body.profile;
    console.log(req.body);
    console.log('Starting oven sim');
    tempProfile.runSim(profile, function(result){
        res.send(result);
    });
});

app.delete('/api/ovensim', function(req, res) {
    tempProfile.stopSim(function(result){
        res.send(result);
    });

});

app.get('/api/profiles', function(req, res) {
   res.send(profiles);
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
    console.log(JSON.stringify(req.session));
    console.log('User is: ' + req.session.user);
    if (req.session && req.session.token) {
        console.log('Session detected');
        /*
        database.checkUser(req.session.user, function(user){
            if(user){
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user;  //refresh the session value
                res.locals.user = user;
            }
        });
        */
        // finishing processing the middleware and run the route
        next();
    } else {
        console.log('No session detected');
        next();
    }
});

app.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    //res.redirect(authorization_uri);
    res.redirect(google_authorization_uri);
});

app.get('/', requireLogin, function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: 'http://localhost:8001/callback',
    scope: 'notifications,user:email',
    state: '3(#0/!~'
});

var google_authorization_uri = googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.email'
});
// should access_type be online?

app.get('/googleauth', function(req, res) {
    var code = req.query.code;
    googleOAuthClient.getToken(code, function(err, tokens){
        if(!err) {
            googleOAuthClient.setCredentials(tokens);
            console.log('Successfully got tokens\nTokens = ' + tokens.access_token);

            req.session.token = tokens.access_token;

            google.oauth2('v2').userinfo.get({userId: 'me', auth: googleOAuthClient}, function(err, result){
                if(err){
                    console.log('Error: ' + err);
                    res.redirect('/login');
                }
                else{
                    console.log('Results: ' + result.email);
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

app.get('/logout', function(req, res){
    req.session.reset();
    res.redirect('/');
});

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
    var code = req.query.code;
    var token;
    oauth2.authCode.getToken({
        code: code,
        redirect_uri: 'http://localhost:8001/callback'
    }, saveToken);

    function saveToken(error, result) {
        if (error) {
            console.log('Access Token Error', error.message);
        }
        token = oauth2.accessToken.create(result);
        req.session.token = token;

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
            }
            var info = JSON.parse(body);
            req.session.user = info.email;
        });

    }

    res.sendFile(__dirname + '/index.html');
});

app.io = io;

module.exports = app;
