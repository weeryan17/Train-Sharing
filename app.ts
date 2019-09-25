var createError = require('http-errors');
// @ts-ignore
const express = require('express');
// @ts-ignore
const path = require('path');
const logger = require('morgan');

const fs = require('fs');
//const formidableMiddleware = require('express-formidable');

var app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// @ts-ignore
app.use('/public', express.static(path.join(global.appRoot, 'public')));
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
            if (fs.lstatSync('./routes/' + parent + '/' + item).isDirectory()) {
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