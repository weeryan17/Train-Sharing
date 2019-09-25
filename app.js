var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    fs.readdir(dir, function (err, items) {
        return __awaiter(this, void 0, void 0, function () {
            var i, item, name_1, type, router;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            console.log(err);
                            return [2];
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3, 9];
                        item = items[i];
                        name_1 = item.split('.')[0];
                        type = item.split('.')[1];
                        if (!(type != 'js')) return [3, 7];
                        if (!fs.lstatSync('./routes/' + parent + '/' + item).isDirectory()) return [3, 6];
                        if (!(parent == '.')) return [3, 3];
                        return [4, readRoutesDir(item)];
                    case 2:
                        _a.sent();
                        return [3, 5];
                    case 3: return [4, readRoutesDir(parent + '/' + item)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3, 8];
                    case 6: return [3, 8];
                    case 7:
                        if (name_1 == 'index') {
                            name_1 = '';
                        }
                        router = require('./routes/' + parent + '/' + item);
                        if (parent == '.') {
                            app.use('/' + name_1, router);
                        }
                        else {
                            app.use('/' + parent + '/' + name_1, router);
                        }
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3, 1];
                    case 9: return [2];
                }
            });
        });
    });
}
console.log("creating error handler");
app.use(function (req, res) {
    console.log("handling error");
    res.locals.message = "Page not found";
    res.locals.status = 404;
    res.status(404);
    res.render('error', { title: 'Error' });
});
module.exports = app;
//# sourceMappingURL=app.js.map