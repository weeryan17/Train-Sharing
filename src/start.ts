// @ts-ignore
var path = require('path');
var mysql = require('mysql');
// @ts-ignore
var fs = require('fs');

var config = JSON.parse(fs.readFileSync("config.json"));

// @ts-ignore
global["appRoot"] = path.resolve(__dirname) + '/../';

var mysql_config = config.database;
mysql_config.typeCast = function castField(field: any, useDefaultTypeCasting: any) {
    if ((field.type === "BIT") && (field.length === 1)) {
        var bytes = field.buffer();
        return (bytes[0] === 1);
    }

    return (useDefaultTypeCasting());
};

// @ts-ignore
global["pool"] = mysql.createPool(mysql_config);
// @ts-ignore
global["config"] = config;

/**
 * Module dependencies.
 */

var app = require('./app.js');
var debug = require('debug')('site:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: any; }) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
