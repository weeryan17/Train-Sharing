// @ts-ignore
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var Recaptcha = require('express-recaptcha').RecaptchaV3;
// @ts-ignore
const recaptcha = new Recaptcha(global.config.recaptcha.site, global.config.recaptcha.secret);

router.get("/add/:type", recaptcha.middleware.render, function (req: any, res: any) {
    if (!req.user) {
        res.redirect('/');
        return;
    }
    var type = req.params.type;
    fs.exists(path.join("views/add", type), function (exists: boolean) {
        if (!exists) {
            res.redirect('/');
            return;
        }

        res.render('add/' + type, {
            title: 'Add item',
            // @ts-ignore
            main_url: global.config.main_site_url,
            type: type,
            captcha: res.recaptcha
        });
    });
});

router.get("/:id", function (req: any, res: any) {

});

module.exports = router;