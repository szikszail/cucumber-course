'use strict';

require('chromedriver');

var fs = require('fs');
var path = require('path');
var sanitize = require("sanitize-filename");
var webdriver = require('selenium-webdriver');

var myHooks = function () {
    this.registerHandler('BeforeFeatures', function () {
        global.driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();

        driver.isElementVisible = function (locator) {
            return driver.isElementPresent(locator).then(function (present) {
                if (!present) {
                    return false;
                }
                return driver.findElement(locator).isDisplayed().then(null, function () {
                    return false;
                });
            });
        };

        driver.waitFor = function (locatorOfFn, timeout) {
            var waitTimeout = timeout || 60 * 1e3;
            if (typeof locatorOfFn === "function") {
                return driver.wait(locatorOfFn, waitTimeout);
            } else {
                if (typeof locatorOfFn === "string") {
                    locatorOfFn = {css: locatorOfFn};
                }
                return driver.wait(function () {
                    return driver.isElementVisible(locatorOfFn);
                }, waitTimeout);
            }
        };

        return driver.manage().window().maximize();
    });

    this.registerHandler('AfterFeatures', function () {
        return driver.quit();
    });

    this.After(function (scenario) {
        if (scenario.isFailed()) {
            driver.takeScreenshot().then(function (data) {
                var base64Data = data.replace(/^data:image\/png;base64,/, "");
                fs.writeFileSync(path.join('screenshots', sanitize(scenario.getName() + ".png").replace(/ /g, "_")), base64Data, 'base64');
            });
        }
        return driver.manage().deleteAllCookies();
    });

};

module.exports = myHooks;