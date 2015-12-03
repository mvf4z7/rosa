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
var api = require('./routes/api');

var redirect = 'http://' + secrets.hostname + ':8001/googleauth';
var googleOAuth2 = google.auth.OAuth2;
var googleOAuthClient = new googleOAuth2(secrets.google.id, secrets.google.secret, redirect);

var oauth2 = require('simple-oauth2')({
    clientID: secrets.github.id,
    clientSecret: secrets.github.secret,
    site: 'https://github.com/login',
    tokenPath: '/oauth/access_token'
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

function requireLogin(req, res, next){
    if(!req.session.token){
        res.sendFile(__dirname + '/login.html');
    }
    else{
        next();
    }
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

app.use('/api', api);

app.use(function(req, res, next) {
    if (req.session && req.session.token) {
        database.checkUser(req.session.user, function(user){
            if(user){
                req.user = user;
                req.session.user = user;  //refresh the session value
                res.locals.user = user;
                console.log('A user logged in: ', user);
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

app.get('/googlelogin', function(req, res) {
    res.redirect(google_authorization_uri);
});

app.get('/githublogin', function(req, res) {
    res.redirect(github_authorization_uri);
});

app.get('/', requireLogin, function(req, res) {
    res.sendFile(__dirname + '/index.html');
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
