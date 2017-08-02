'use strict';

var path = require('path');
var fs = require('fs');
var open = require('open');
var nodeModules = path.resolve(path.resolve(__dirname, ''), 'node_modules');
var swaggerUiDist = path.dirname(require.resolve('swagger-ui-dist'));
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var watch = require('node-watch');
var swaggerParser = require('swagger-parser');

function start(swaggerFile, targetDir, port, hostname, bundleTo) {
  app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  app.use(express.static(swaggerUiDist));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  io.on('connection', function(socket) {  
    socket.on('uiReady', function(data) {
      swaggerParser.bundle(swaggerFile, function(err, bundled) {
        if (err) {
          socket.emit('showError', err);
          return;
        }
        socket.emit('updateSpec', JSON.stringify(bundled));
      });       
    });
  });

  watch(targetDir, {recursive: true}, function(eventType, name) {
    swaggerParser.bundle(swaggerFile, function(err, bundled) {
      if (err) {
        io.sockets.emit('showError', err);
        return;
      }
      console.log("File changed. Sent updated spec to the browser.");
      var bundleString = JSON.stringify(bundled, null, 2);
      io.sockets.emit('updateSpec', bundleString);
      if (typeof bundleTo === 'string') {
        fs.writeFile(bundleTo, bundleString, function(err) {
          if (err) {
            io.sockets.emit('showError', err);
            return;
          }
          console.log('Saved bundle file at ' + bundleTo);
        });
      }
    });  
  });

  server.listen(port,hostname, function() {
    open('http://' + hostname + ':' + port);
  });
}

module.exports = {
  start: start
}