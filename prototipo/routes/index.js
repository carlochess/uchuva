var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var archivos = require('../utils/file.js');
var router = express.Router();
var config = require('../config');
var logger = require('../utils/logger.js');
var isAuthenticated = require('../utils/login.js');
var File = require('../models/file.js');

router.get('/', function(req, res) {
    res.render('index', {
        user: req.user
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

function fechaActual() {
    return new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');
}

function createRootFolder(userId, cb){
    var f = new File({
        filename: "/",
        originalname: "/",
        destination: "/",
        uploadDate: fechaActual(),
        path: "/",
        type: "dir",
        owner: userId
    });
    f.save(cb);
}

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
            logger.error("POST /register Error trying to register: "+err);
            res.format({
              html: function() {
                res.render('register', {
                    account: account,
                    error: err
                });
              },
              json: function() {
                res.json({
                  code:1,
                  message: err+""
                });
              }
            });
            return;
        }
        createRootFolder(account._id, function(err, folder){
          if (err) {
              logger.error("POST /register Error trying to register: "+err);
              // account.delete()
              res.format({
                html: function() {
                  res.render('register', {
                      account: account,
                      error: err
                  });
                },
                json: function() {
                  res.json({
                    code:2,
                    message: err+""
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
                apikey : account.apikey,
                rootfolder : folder._id
              });
            }
          });
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

router.post('/loginapi', function handleLocalAuthentication(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.json({
                error : 1,
                message: "no user found"
            });
        }
        return res.json({
            apikey: user.apikey,
        });
    })(req, res, next);
});

router.get('/logout', isAuthenticated, function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
