var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs');
var app = express();
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(global.appRoot, 'public')));
readRoutesDir('.');
function readRoutesDir(parent) {
    var dir = path.join(global.appRoot, 'routes', parent);
    var items = fs.readdirSync(dir);
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var split = item.split('.');
        var name_1 = item.split('.')[0];
        var type = split[split.length - 1];
        if (type != 'js') {
            if (fs.lstatSync('./routes/' + parent + '/' + item).isDirectory()) {
                if (parent == '.') {
                    readRoutesDir(item);
                }
                else {
                    readRoutesDir(parent + '/' + item);
                }
                continue;
            }
            else {
                continue;
            }
        }
        if (name_1 == 'index') {
            name_1 = '';
        }
        var router_path = './routes/' + parent + '/' + item;
        console.log(router_path);
        var router = require(router_path);
        if (parent == '.') {
            app.use('/' + name_1, router);
        }
        else {
            app.use('/' + parent + '/' + name_1, router);
        }
    }
}
app.use(function (req, res) {
    res.locals.message = "Page not found";
    res.locals.status = 404;
    res.status(404);
    res.render('error', { title: 'Error' });
});
module.exports = app;
//# sourceMappingURL=app.js.map