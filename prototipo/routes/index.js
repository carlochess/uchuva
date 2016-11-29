var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Dag = require('../models/dag');
var archivos = require('../utils/file.js');
var router = express.Router();
var config = require('../config');
var logger = require('../utils/logger.js');
var isAuthenticated = require('../utils/login.js');

router.get('/', function(req, res) {
    res.render('index', {
        user: req.user
    });
});

router.get('/user', isAuthenticated, function(req, res) {
    Dag.find({
        userid: req.user._id
    }, null, {
        sort: {
            date: -1
        }
    }, function(err, dags) {
        if(err){
          logger.error("Error trying to get dags: "+err);
        }
        res.format({
            html: function() {
                res.render('home', {
                    user: req.user,
                    dags: dags,
                    title: "Home",
                    mensajes : req.flash('error')
                });
            },
            json: function() {
                res.json(dags);
            }
        });
    });
});

router.get('/register', function(req, res) {
    if (req.user) {
        res.redirect('/user');
        return;
    }
    res.render('register', {
        title: "Registro"
    });
});

router.post('/register', function(req, res) {
    if (req.user) {
        res.redirect('/user');
        return;
    }
    var apikey = archivos.randomChars(20);
    var password = req.body.password;
    var username = req.body.username;
    if(config.IS_TESTING){
      apikey = username;
    }
    User.register(new User({
        username: username,
        apikey: apikey
    }), password, function(err, account) {
        if (err) {
            logger.error("Error trying to register: "+err);
            res.format({
              html: function() {
                res.render('register', {
                    account: account,
                    error: err
                });
              },
              json: function() {
                res.json({
                  error: err
                });
              }
            });
            return;
        }
        res.format({
          html: function() {
            passport.authenticate('local')(req, res, function() {
                res.redirect('/user');
            });
          },
          json: function() {
            res.json({
              username : account.username,
              apikey : account.apikey
            });
          }
        });
    });
});

router.get('/developers', isAuthenticated, function(req, res) {
    res.render('developers', {
        user: req.user,
        apikey: req.user.apikey,
        title: "Developers",
    });
});

router.get('/login', function(req, res) {
    if (req.user) {
        res.redirect('/user');
        return;
    }
    var mensajes = req.flash("error");
    res.render('login', {
        user: req.user,
        title: "Login",
        mensajes: mensajes
    });
});

router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true,
}), function(req, res) {
    res.redirect('/user');
});

router.get('/logout', isAuthenticated, function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
