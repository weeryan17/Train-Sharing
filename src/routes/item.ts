// @ts-ignore
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var Recaptcha = require('express-recaptcha').RecaptchaV3;
// @ts-ignore
const recaptcha = new Recaptcha(global.config.recaptcha.site, global.config.recaptcha.secret);

router.get("/add/:type", recaptcha.middleware.renderWith({theme: "dark"}), function (req: any, res: any) {
    if (req.user == undefined) {
        res.redirect('/');
        return;
    }
    var type = req.params.type;
    // @ts-ignore
    var type_file = path.join(global.appRoot, "views/add", type + ".ejs");
    fs.exists(type_file, function (exists: boolean) {
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