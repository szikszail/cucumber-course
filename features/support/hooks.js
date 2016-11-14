'use strict';

require('chromedriver');

var fs = require('fs');
var path = require('path');
var sanitize = require("sanitize-filename");
var webdriver = require('selenium-webdriver');

global.driver = new webdriver.Builder().forBrowser('chrome').build();

Object.assign(global.driver, {
    isElementVisible: function (locator) {
        return global.driver.isElementPresent(locator).then(function (present) {
            if (!present) {
                return false;
            }
            return global.driver.findElement(locator).isDisplayed().then(null, function () {
                return false;
            });
        });
    },
    waitFor: function (locatorOfFn, timeout) {
        var waitTimeout = timeout || 60 * 1e3;
        if (typeof locatorOfFn === "function") {
            return global.driver.wait(locatorOfFn, waitTimeout);
        } else {
            if (typeof locatorOfFn === "string") {
                locatorOfFn = {css: locatorOfFn};
            }
            return global.driver.wait(function () {
                return global.driver.isElementVisible(locatorOfFn);
            }, waitTimeout);
        }
    }
});

var myHooks = function () {
    this.registerHandler('BeforeFeatures', function () {
        return global.driver.manage().window().maximize();
    });

    this.registerHandler('AfterFeatures', function () {
        return global.driver.quit();
    });

    this.After(function (scenario) {
        if (scenario.isFailed()) {
            global.driver.takeScreenshot().then(function (data) {
                var base64Data = data.replace(/^data:image\/png;base64,/, "");
                fs.writeFileSync(path.join('screenshots', sanitize(scenario.getName() + ".png").replace(/ /g, "_")), base64Data, 'base64');
            });
        }
        return global.driver.manage().deleteAllCookies();
    });

};

module.exports = myHooks;