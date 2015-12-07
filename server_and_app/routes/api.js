var express = require('express');
var router = express.Router();

var history = require('./api/history');
var oven = require('./api/oven');
var profile = require('./api/profile');
var user = require('./api/user');

router.route('/ovensim')
    .get(function(req, res) { oven.getOvenState(req, res) })
    .put(function(req, res) { oven.startOven(req, res)})
    .delete(function(req, res) { oven.stopOven(req, res) });

router.route('/profiles')
    .get(function(req, res) { profile.getProfiles(req, res) })
    .post(function(req, res) { profile.addProfile(req, res)});

router.route('/profiles/:pname')
    .put(function(req, res) { profile.editProfile(req, res, req.params.pname) })
    .delete(function(req, res) { profile.removeProfile(req, res, req.params.pname) });

router.route('/allusers')
    .get(function(req, res) { user.getAllUsers(req, res) });

router.route('/adduser')
    .post(function(req, res) { user.addUser(req, res) });

router.route('/removeuser')
    .post(function(req, res) { user.removeUser(req, res) });

module.exports = router;