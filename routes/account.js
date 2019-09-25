var passport = require("passport");
var localStrategy = require("passport-local");
var bcrypt = require('bcrypt');
var discordStrategy = require('passport-discord').Strategy;
var express = require('express');
var router = express.Router();
passport.use(new localStrategy(function (username, password, done) {
    done(null, username);
}));
//# sourceMappingURL=account.js.map