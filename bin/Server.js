#!/usr/bin/env node

/** 
 * Cluster dependencies 
 * this app will take 1(master thread) + instancesNum(worker threads)
*/

var cluster = require('cluster')
var instancesNum = 5;

/**
 * Module dependencies.
 */

if (cluster.isMaster) {
  masterFunction()
} else {
  workerFunction()
}

function masterFunction() {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Launching: ${instancesNum} workers`);
  for (var i = 0; i < instancesNum; i++) {
    cluster.fork();
  }
  console.log('all workers was launched');

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

}

function workerFunction() {
  console.log(`Worker process: ${process.pid} is running`);
  var app = require('../app');
  var debug = require('debug')('cms:server');
  var http = require('http');

  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort(process.env.PORT || '3000');
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

  function normalizePort(val) {
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

  function onError(error) {
    if (error.syscall !== 'listen') {
      console.log(`Primary ${process.pid} throwed an error:`);
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`Worker process ${process.pid} requires elevated privileges, throwed error`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Worker process ${process.pid} is already in use`);
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
    console.error(`Worker process: ${process.pid} is listening`);
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
}
