// @ts-ignore
var express = require('express');
var router = express.Router();

import ApolloClient from 'apollo-client'
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';

// @ts-ignore
router.get('/login', global.passport.authenticate('oauth2'));

router.get('/login/callback', function(req: any, res: any, next: any) {
    // @ts-ignore
    global.passport.authenticate('oauth2', function (err: any, user: any, info: any) {
        if (err) {
            console.error(err);
            req.app.locals.error = err;
            req.app.locals.message = "Error while logging in";
            return next();
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/account/login');
        }
        req.login(user, function (err: any) {
            if (err) {
                console.error(err);
                req.app.locals.error = err;
                req.app.locals.message = "Error while logging in";
                return next();
            }
            console.log("logged in " + JSON.stringify(user));
            req.flash('messages', "Logged in");
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get("/info", function (req: any, res: any) {
    console.log(req.user);
    if (req.user !== undefined) {
        // @ts-ignore
        global.pool.getConnection(function (err: any, connection: any) {
            if (err) {
                console.error(err);
                res.json({
                    error: true
                });
                return;
            }

            connection.query("SELECT access_token FROM traincarts_sharing_users WHERE id = ?",
                [req.user],
                function (err: any, results: any) {
                connection.release();
                    if (err) {
                        console.error(err);
                        res.json({
                            error: true
                        });
                        return;
                    }

                    if (results.length == 0) {
                        console.log("User not found!");
                    }

                    let access_token = results[0].access_token;

                    const authLink = setContext((_, {headers}) => {
                        return {
                            headers: {
                                ...headers,
                                authorization: access_token ? `Bearer ${access_token}` : "",
                            }
                        }
                    });

                    const httpLink = createHttpLink({
                        uri: "http://localhost:3000/api/user",
                        // @ts-ignore
                        fetch: fetch
                    });

                    const graphqlClient = new ApolloClient({
                        link: authLink.concat(httpLink),
                        cache: new InMemoryCache()
                    });
                    console.log("Execute query");
                    graphqlClient.query({
                        query: gql`
                            query Query {
                                user {
                                    name
                                }
                            }
                        `,
                    }).then(function (data: any) {
                        res.json({
                            login: true,
                            id: req.user.id,
                            name: data.data.user.name
                        });
                    }).catch(function (error: any) {
                        console.error(error);
                        res.json({
                            error: true
                        });
                    });
                });
        });
    } else {
        res.json({
            login: false
        })
    }
});

module.exports = router;