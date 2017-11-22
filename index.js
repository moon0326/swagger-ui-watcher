'use strict';

var path = require('path');
var fs = require('fs');
var open = require('open');
var swaggerUiDist = path.dirname(require.resolve('swagger-ui-dist'));
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var watch = require('node-watch');
var JsonRefs = require('json-refs');
var yaml = require('js-yaml');

function bundle(swaggerFile) {
  var root = yaml.safeLoad(fs.readFileSync(swaggerFile, 'utf8'));
  var options = {
    filter : ['relative', 'remote'],
    location: swaggerFile,
    loaderOptions : {
      processContent : function (res, callback) {
        callback(undefined, yaml.safeLoad(res.text));
      }
    }
  };
  JsonRefs.clearCache();
  return JsonRefs.resolveRefs(root, options).then(function (results) {
    return results.resolved;
  }, function (e) {
      var error = {};
      Object.getOwnPropertyNames(e).forEach(function (key) {
        error[key] = e[key];
      });
      return Promise.reject(error);
  });
}

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
      bundle(swaggerFile).then(function (bundled) {
        socket.emit('updateSpec', JSON.stringify(bundled));
      }, function (err) {
        socket.emit('showError', err);
      });
    });
  });

  watch(targetDir, {recursive: true}, function(eventType, name) {
    bundle(swaggerFile).then(function (bundled) {
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
    }, function (err) {
      io.sockets.emit('showError', err);
    });
  });

  server.listen(port,hostname, function() {
    open('http://' + hostname + ':' + port);
  });
}

module.exports = {
  start: start
}
