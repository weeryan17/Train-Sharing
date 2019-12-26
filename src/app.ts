var createError = require('http-errors');

// @ts-ignore
const express = require('express');
// @ts-ignore
const path = require('path');
const logger = require('morgan');
const flash = require('connect-flash');

const passport = require('passport');
const oAuth2Strategy = require('passport-oauth2');

passport.serializeUser(function(user : any, done : any) {
    done(null, user);
});

passport.deserializeUser(function(user : any, done : any) {
    done(null, user);
});
// @ts-ignore
passport.use(new oAuth2Strategy(global.config.oauth, function (accessToken: string, refreshToken: string, profile: {id: number}, cb: (err: any, user: {id: number}) => void) {
    console.log(accessToken + " " + refreshToken);
    return cb(null, {id: profile.id});
}));

// @ts-ignore
global["passport"] = passport;
// @ts-ignore
const fs = require('fs');
//const formidableMiddleware = require('express-formidable');

var app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// @ts-ignore
app.use('/public', express.static(path.join(global.appRoot, 'public')));

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));

var session = require('express-session');
var fileStore = require('session-file-store')(session);

app.use(session({
    store: new fileStore({}),
    secret: config.session.secret
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//app.use(formidableMiddleware());

readRoutesDir('.');

function readRoutesDir(parent: string) {
    // @ts-ignore
    var dir = path.join(global.appRoot, 'routes', parent);
    var items = fs.readdirSync(dir);


    for (let i: number = 0; i < items.length; i++) {
        let item: string = items[i];
        var split: string[] = item.split('.');
        let name: string = item.split('.')[0];
        let type: string = split[split.length - 1];

        if (type != 'js') {
            if (fs.lstatSync('./src/routes/' + parent + '/' + item).isDirectory()) {
                if (parent == '.') {
                    readRoutesDir(item);
                } else {
                    readRoutesDir(parent + '/' + item);
                }
                continue;
            } else {
                continue;
            }
        }

        if (name == 'index') {
            name = '';
        }

        var router_path = './routes/' + parent + '/' + item;

        console.log(router_path);

        var router = require(router_path);

        if (parent == '.') {
            app.use('/' + name, router);
        } else {
            app.use('/' + parent + '/' + name, router);
        }
    }
}

// error handler
app.use(function (req: any, res: any) {
    res.locals.message = "Page not found";
    res.locals.status = 404;

    // render the error page
    res.status(404);
    res.render('error', {title: 'Error'});
});

module.exports = app;