// @ts-ignore
var express = require('express');
var router = express.Router();

router.get('/login', passport.authenticate('oauth2'));
router.get('/login/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }), function (req: any, res: any) {
    res.send("works!")
});

module.exports = router;