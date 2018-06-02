#!/usr/bin/env node
'use strict';

var version = require('../package.json').version
var program = require('commander');
var fs = require('fs');
var path = require('path');
var swaggerFileValue;
var targetDirValue;
var help = 'Enter "swagger-ui-watcher --help" for more details.';

/*
 * NOTE: the '--no-open' option will set its inverse counterpart `program.open`;
 * this will always be set accordingly, see https://github.com/tj/commander.js#option-parsing.
 */
program
    .version(version)
    .arguments('<swaggerFile> [targetDir]')
    .option('-p, --port <port>', 'Port to be used. Default is 8000')
    .option('-h, --host <Hostname|Ip>', 'Host to be used. Default is 127.0.0.1')
    .option('-b, --bundle <bundleTo>', 'Create bundle and save it to bundleTo')
    .option('--no-open', 'Do not open the view page in the default browser')
    .action(function(swaggerFile, targetDir) {
        swaggerFileValue = swaggerFile;
        targetDirValue = targetDir;
    })
    .parse(process.argv);

if (typeof swaggerFileValue === 'undefined') {
    console.error(`<swaggerFile> is required.\n${help}`);
    process.exit(1);
}

if (typeof targetDirValue === 'undefined') {
    try {
        if (!path.isAbsolute(swaggerFileValue)) {
            swaggerFileValue = path.resolve(process.cwd(), swaggerFileValue);
        }
        targetDirValue = path.dirname(swaggerFileValue);
    } catch (err) {
        console.error(`Failed to resolve path to [targetDir].\n${help}`);
        process.exit(1);
    }
}

if (typeof program.port === 'undefined') {
    program.port = 8000;
}

if (typeof program.host === 'undefined') {
    program.host = "127.0.0.1";
}

if (typeof program.bundle === 'undefined') {
    program.bundle = null;
}

if (program.bundle === swaggerFileValue) {
    console.error("<bundle> value cannot be same as <swaggerFile> value.");
    process.exit(1);
}

if (!fs.existsSync(targetDirValue)) {
    console.error(targetDirValue + " does not exist.");
    process.exit(1);
}

if (!fs.existsSync(swaggerFileValue)) {
    console.error(swaggerFileValue + " does not exist.");
    process.exit(1);
}

if (program.bundle === null) {
    require("../index.js").start(
        swaggerFileValue,
        targetDirValue,
        program.port,
        program.host,
        program.open
    );
} else {
    require("../index.js").build(
        swaggerFileValue,
        targetDirValue,
        program.bundle
    );
}
