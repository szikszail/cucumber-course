'use strict';

var expect = require('chai').expect;

module.exports = function() {
    this.World = require('../support/world.js').World;

    var EMAIL_INPUT_SELECTOR = '#Email',
        PWD_INPUT_SELECTOR = '#Passwd',
        NEXT_BUTTON_SELECTOR = '#next',
        LOGIN_BUTTON_SELECTOR = '#signIn',
        SUBJECT_HEADER_SELECTOR = 'h2.hP',
        NEED_HELP_SELECTOR = '.need-help',
        FIRST_RESULT_XPATH = '//tr[contains(@class,"zA")][1]/td/div/div/div/span',
        ALL_RESULTS_XPATH = '//tr[contains(@class,"zA")]';

    function getMenuItemSelector(title) {
        return {css: 'a[href$="#' + title + '"]'};
    }

    function getResultSelector(subject) {
        return {xpath: '//tr[contains(@class,"zA")]/td/div/div/div/span[normalize-space(.)="' + subject + '"]'};
    }

    function getElementWithTextSelector(text) {
        return {xpath: '//*[contains(normalize-space(.), "' + text + '")]'};
    }

    this.Given(/^I login to my gmail account$/, function (callback) {
        var self = this;
        this.driver.get('http://gmail.com');
        this.waitFor(NEED_HELP_SELECTOR);
        this.driver.findElement({ css: EMAIL_INPUT_SELECTOR }).isDisplayed().then(function(displayed) {
            if (displayed) {
                self.driver.findElement({ css: EMAIL_INPUT_SELECTOR }).sendKeys('epamdebrecenta');
                self.driver.findElement({ css: NEXT_BUTTON_SELECTOR }).click();
                self.waitFor(PWD_INPUT_SELECTOR);
            }
        });
        this.driver.findElement({ css: PWD_INPUT_SELECTOR }).sendKeys('Pass1212');
        this.driver.findElement({ css: LOGIN_BUTTON_SELECTOR }).click();
        this.waitFor(getMenuItemSelector('inbox'));
        callback();
    });

    this.When(/^I click on "([^"]+)" menu item$/, function (menu, callback) {
        var self = this;
        this.driver.findElement(getMenuItemSelector(menu)).click();
        this.waitFor(function(){
            return self.driver.getCurrentUrl().then(function(url){
                return new RegExp('#' + menu + '$').test(url);
            });
        });
        callback();
    });

    this.When(/^I click on the result "([^"]+)"$/, function (result, callback) {
        this.driver.findElement(getResultSelector(result)).click();
        this.waitFor(SUBJECT_HEADER_SELECTOR);
        callback();
    });

    this.Then(/^the first result should be "([^"]+)"$/, function (title, callback) {
        this.driver.findElement({ xpath: FIRST_RESULT_XPATH }).getText().then(function(text) {
            expect(text).to.equal(title);
            callback();
        });
    });

    this.Then(/^the number of the "([^"]+)" results should be (\d+)$/, function (title, results, callback) {
        this.driver.findElements({ xpath: ALL_RESULTS_XPATH }).then(function(elements) {
            expect(elements.length).to.equal(+results);
            callback();
        });
    });

    this.Then(/^the text "([^"]+)" should be (displayed|hidden)$/, function (text, status, callback) {
        var self = this;
        this.driver.isElementPresent(getElementWithTextSelector(text)).then(function(isPresent){
            if (isPresent) {
                self.driver.findElement(getElementWithTextSelector(text)).isDisplayed().then(function(displayed){
                    expect(displayed).to.equal(status === "displayed");
                    callback();
                });
            } else {
                expect(false).to.equal(status === "displayed");
                callback();
            }
        });
    });
};