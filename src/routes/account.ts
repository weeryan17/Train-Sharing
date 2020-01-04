// @ts-ignore
var express = require('express');
var router = express.Router();

// @ts-ignore
router.get('/login', global.passport.authenticate('oauth2'));
// @ts-ignore
router.get('/login/callback', global.passport.authenticate('oauth2', { failureRedirect: '/login' }), function (req: any, res: any) {
    res.send("works!")
});

module.exports = router;