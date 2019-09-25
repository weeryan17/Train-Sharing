var createError = require('http-errors');
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
    fs.readdir(dir, async function (err: any, items: string[]) {
        if (err) {
            console.log(err);
            return;
        }

        for (let i: number = 0; i < items.length; i++) {
            let item: string = items[i];
            let name: string = item.split('.')[0];
            let type: string = item.split('.')[1];

            if (type != 'js') {
                if (fs.lstatSync('./routes/' + parent + '/' + item).isDirectory()) {
                    if (parent == '.') {
                        await readRoutesDir(item);
                    } else {
                        await readRoutesDir(parent + '/' + item);
                    }
                    continue;
                } else {
                    continue;
                }
            }

            if (name == 'index') {
                name = '';
            }

            var router = require('./routes/' + parent + '/' + item);

            if (parent == '.') {
                app.use('/' + name, router);
            } else {
                app.use('/' + parent + '/' + name, router);
            }
        }
    });
}

/*app.use(function (req: any, res: any, next: any) {
    var error = {"message": "Page not found", "status": 404};
    console.log("past create error");
    next(error);
});*/

console.log("creating error handler");

// error handler
app.use(function (req: any, res: any) {
    console.log("handling error");
    // set locals, only providing error in development
    res.locals.message = "Page not found";
    res.locals.status = 404;

    // render the error page
    res.status(404);
    res.render('error', { title: 'Error' });
});

module.exports = app;