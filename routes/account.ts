var passport = require("passport");
var oauth2 = require("passport-oauth2");

// @ts-ignore
var express = require('express');
var router = express.Router();

passport.use(new oauth2({

    },
    function (accessToken : string, refreshToken : string, profile : object, cb: any) {

    }));