'use strict';

var fs = require('fs');
var webdriver = require('selenium-webdriver');
var platform = process.env.PLATFORM || "CHROME";

var buildChromeDriver = function() {
    return new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
        build();
};
var driver = buildChromeDriver();

var getDriver = function() {
    return driver;
};

var World = function World(callback) {

    var defaultTimeout = 20000;
    var screenshotPath = "screenshots";

    this.webdriver = webdriver;
    this.driver = driver;

    if(!fs.existsSync(screenshotPath)) {
        fs.mkdirSync(screenshotPath);
    }

    this.waitFor = function(cssLocatorOfFn, timeout) {
        var waitTimeout = timeout || defaultTimeout;
        if (typeof cssLocatorOfFn === "function") {
            return driver.wait(cssLocatorOfFn, waitTimeout);
        } else {
            return driver.wait(function () {
                return driver.isElementPresent({css: cssLocatorOfFn});
            }, waitTimeout);
        }
    };

    callback();
};

module.exports.World = World;
module.exports.getDriver = getDriver;