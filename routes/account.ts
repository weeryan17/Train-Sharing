var passport = require("passport");
var localStrategy = require("passport-local");
var bcrypt = require('bcrypt');
var discordStrategy = require('passport-discord').Strategy;

// @ts-ignore
var express = require('express');
var router = express.Router();

passport.use(new localStrategy(function (username : string, password : string, done: (error: any, result: boolean | any, data?: object) => void) {
    //TODO handle users from database
    done(null, username)
}));

passport.use(new discordStrategy(config.discord), function (accessToken : string, refreshToken : string, profile : object, cb : any) {
    
});