// @ts-ignore
const express = require('express');
// @ts-ignore
const path = require('path');
const logger = require('morgan');
const flash = require('connect-flash');

const passport = require('passport');
const oAuth2Strategy = require('passport-oauth2');

import ApolloClient from 'apollo-client'
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';

oAuth2Strategy.prototype.userProfile = function (accessToken: string, done: (err: any, user: { id: number }) => void) {
    console.log("profile");
    // @ts-ignore
    const authLink = setContext((_, {headers}) => {
        return {
            headers: {
                ...headers,
                authorization: accessToken ? `Bearer ${accessToken}` : "",
            }
        }
    });

    const httpLink = createHttpLink({
        // @ts-ignore
        uri: global.config.main_url + "/api/user",
        // @ts-ignore
        fetch: fetch
    });

    const graphqlClient = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });

    graphqlClient.query({
        query: gql`
            query Query {
                user {
                    id
                }
            }
        `,
    }).then(function (data: any) {
        done(null, data.data.user);
    }).catch(function (error: any) {
        done(error, null);
    });
};

passport.serializeUser(function (user: any, done: any) {
    done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
    done(null, user);
});
// @ts-ignore
passport.use(new oAuth2Strategy(global.config.oauth, function (accessToken: string, refreshToken: string, profile: { id: number }, cb: (err: any, user: { id: number }) => void) {
    console.log('oauth');
    // @ts-ignore
    global.pool.getConnection(function (err: any, connection: any) {
        if (err) {
            console.error(err);
            return;
        }

        connection.query("SELECT access_token FROM traincarts_sharing_users WHERE id = ?",
            [profile.id],
            function (err: any, results: any) {
                if (err) {
                    console.error(err);
                    connection.release();
                    return cb(err, null);
                }
                if (results.length == 0) {
                    connection.query("INSERT INTO traincarts_sharing_users (id, access_token, refresh_token) VALUES (?, ?, ?)",
                        [profile.id, accessToken, refreshToken],
                        function (err: any) {
                            connection.release();
                            if (err) {
                                console.error(err);
                                return cb(err, null);
                            }

                            return cb(null, {id: profile.id});
                        });
                } else {
                    connection.query("UPDATE traincarts_sharing_users SET access_token = ?, refresh_token = ? WHERE id = ?",
                        [accessToken, refreshToken, profile.id],
                        function (err: any) {
                            connection.release();
                            if (err) {
                                console.error(err);
                                return cb(err, null);
                            }

                            return cb(null, {id: profile.id});
                        });
                }
            });
    });
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

var redis = require('redis');
// @ts-ignore
var redisClient = redis.createClient(global.config.redis);

redisClient.on("connect", function () {
    console.log("Redis connected");
});

redisClient.on("error", function (err: any) {
    console.error(err);
});

var session = require('express-session');
var redisStore = require('connect-redis')(session);

app.use(session({
    store: new redisStore({client: redisClient}),
    secret: config.session.secret,
    resave: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//app.use(formidableMiddleware());

readRoutesDir('.');

function readRoutesDir(parent: string) {
    // @ts-ignore
    var dir = path.join(global.appRoot, 'src/routes', parent);
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
    if (req.app.locals.message === undefined) {
        req.app.locals.message = "Page not found";
        req.app.locals.status = 404;
    }
    var error: boolean | any = false;
    if (req.app.locals.error !== undefined) {
        error = req.app.locals.error;
        if (req.app.locals.status === undefined) {
            req.app.locals.status = 500;
        }
    }

    // render the error page
    res.sendStatus(req.app.locals.status);
    // @ts-ignore
    res.render('error', {title: 'Error', messages: req.messages, error: error, main_url: global.config.main_site_url});
});

module.exports = app;