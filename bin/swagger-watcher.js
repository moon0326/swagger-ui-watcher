#!/usr/bin/env node
'use strict';

var program = require('commander');
var fs = require('fs');
var swaggerFileValue;
var targetDirValue;

program
    .version('1.0')
    .arguments('<swaggerFile> <targetDir>')
    .option('-p, --port <port>', 'Port to be used. Default is 8000')
    .option('-h, --host <Hostname|Ip>', 'Host to be used. Default is 127.0.0.1')
    .action(function(swaggerFile, targetDir) {
        swaggerFileValue = swaggerFile;
        targetDirValue = targetDir;
    });

program.parse(process.argv);

if (typeof targetDirValue === 'undefined') {
    console.error("<targetDir> is required. Syntax is swagger-watcher <swaggerFile> <targetDir>");
    process.exit(1);
}

if (typeof swaggerFileValue === 'undefined') {
    console.error("<swaggerFileValue> is required. Syntax is swagger-watcher <swaggerFile> <targetDir>");
    process.exit(1);
}

if (typeof program.port === 'undefined') {
    program.port = 8000;
}
if (typeof program.host === 'undefined') {
    program.host = "127.0.0.1";
}

require("../index.js").start(swaggerFile, targetDir, program.port,program.host,program.folder);
