var express = require('express');
var router = express.Router();
router.get('/login', passport.authenticate('oauth2'));
router.get('/login/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }), function (req, res) {
    res.send("works!");
});
module.exports = router;
//# sourceMappingURL=account.js.map