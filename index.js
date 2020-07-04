'use strict';

var path = require('path');
var fs = require('fs');
var open = require('open');
var nodeModules = path.resolve(path.resolve(__dirname, ''), 'node_modules');
var swaggerEditorDist = path.dirname(require.resolve('swagger-editor-dist/index.html'));
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var chokidar = require('chokidar');
var JsonRefs = require('json-refs');
var yaml = require('js-yaml');

function dictToString(dict) {
  var res = [];
  for (const [k, v] of Object.entries(dict)) {
    res.push(`${k}: ${v}`);
  }
  return res.join('\n');
}

function bundle(swaggerFile) {
  var root = yaml.safeLoad(fs.readFileSync(swaggerFile, 'utf8'));
  var options = {
    filter : ['relative', 'remote'],
    resolveCirculars: true,
    location: swaggerFile,
    loaderOptions : {
      processContent : function (res, callback) {
        callback(undefined, yaml.safeLoad(res.text));
      }
    }
  };
  JsonRefs.clearCache();
  return JsonRefs.resolveRefs(root, options).then(function (results) {
    var resErrors = {};
    for (const [k,v] of Object.entries(results.refs)) {
      if ('missing' in v && v.missing === true && (v.type == 'relative' || v.type === 'remote'))
        resErrors[k] = v.error;
    }

    if (Object.keys(resErrors).length > 0) {
      return Promise.reject(dictToString(resErrors));
    }

    return results.resolved;
  }, function (e) {
      var error = {};
      Object.getOwnPropertyNames(e).forEach(function (key) {
        error[key] = e[key];
      });
      return Promise.reject(dictToString(error));
  });
}

function start(swaggerFile, targetDir, port, hostname, openBrowser, swaggerUIOptions) {
  app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  app.use(express.static(swaggerEditorDist));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  io.on('connection', function(socket) {
    socket.on('swaggerReady', function (data) {
      bundle(swaggerFile).then(function (bundled) {
        socket.emit('updateSpec', JSON.stringify(bundled));
      }, function (err) {
        socket.emit('showError', err);
      });
    });
    socket.once('uiReady', function(data) {
      socket.emit('swaggerOptions', swaggerUIOptions);
    });
  });

  chokidar.watch(targetDir).on('change', function(eventType, name) {
    bundle(swaggerFile).then(function (bundled) {
      console.log("File changed. Sent updated spec to the browser.");
      var bundleString = JSON.stringify(bundled, null, 2);
      io.sockets.emit('updateSpec', bundleString);
    }, function (err) {
      io.sockets.emit('showError', err);
    });
  });

  server.listen(port,hostname, function() {
    var serverUrl = `http://${hostname}:${port}`;
    console.log(`Listening on ${serverUrl}`);
    if (openBrowser) open(serverUrl);
  });
}

function build (swaggerFile, targetDir, bundleTo) {
  bundle(swaggerFile).then(function (bundled) {
      var bundleString = JSON.stringify(bundled, null, 2);
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
}

module.exports = {
  start: start,
  build: build
};
