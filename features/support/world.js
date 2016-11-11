'use strict';

var fs = require('fs');
var screenshotPath = "screenshots";

if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath);
}

global.expect = require('chai').expect;

var World = function World() {
};

module.exports.World = World;