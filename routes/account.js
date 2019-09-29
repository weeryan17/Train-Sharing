var passport = require("passport");
var oauth2 = require("passport-oauth2");
var express = require('express');
var router = express.Router();
passport.use(new oauth2({}, function (accessToken, refreshToken, profile, cb) {
}));
//# sourceMappingURL=account.js.map