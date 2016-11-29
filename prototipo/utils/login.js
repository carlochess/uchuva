
var express = require('express');
var passport = require('passport');

var apiKeyFilter = passport.authenticate('localapikey', {
    session: false
});

var isAuthenticated = function(req, res, next) {
    if (req.get("apikey")) {
        return apiKeyFilter(req, res, next);
    }
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

module.exports = isAuthenticated;
