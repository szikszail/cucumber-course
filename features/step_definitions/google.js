'use strict';

var expect = require('chai').expect;

module.exports = function() {
    var self = this;

    this.World = require('../support/world.js').World;

    var INPUT_FIELD_SELECTOR = '#lst-ib',
        SUBMIT_SEARCH = 'input[type="submit"][name="btnK"]',
        FIRST_SEARCH_RESULT = '.srg > .g:first-child',
        FIRST_SEARCH_RESULT_TITLE = FIRST_SEARCH_RESULT + ' > .rc > .r > a';

    function getResultElement(text) {
        return self.driver.findElement({ xpath: '//*[@class="r"]/a[normalize-space(.)="' + text + '"]' });
    }

    this.Given(/^the Google page is opened$/, function (callback) {
        this.driver.get('http://google.com');
        this.waitFor(INPUT_FIELD_SELECTOR).then(function(){
            callback();
        }, callback);
    });

    this.When(/^the text "([^"]*)" is entered into the search field$/, function (query, callback) {
        this.driver.findElement({ css: INPUT_FIELD_SELECTOR }).sendKeys(query);
        this.driver.findElement({ css: SUBMIT_SEARCH }).click();
        this.waitFor(FIRST_SEARCH_RESULT).then(function(){
            callback();
        }, callback);
    });

    this.When(/^the text "([^"]+)" is clicked$/, function (title, callback) {
        getResultElement(title).getAttribute('href').then(function(href) {
            getResultElement(title).click();
            this.waitFor(function(){
                return this.driver.getCurrentUrl().then(function(url){
                    return url === href;
                });
            }).then(function(){
                callback();
            }, callback);
        }, callback);
    });

    this.Then(/^the first result is "([^"]+)"$/, function (title, callback) {
        this.driver.findElement({ css: FIRST_SEARCH_RESULT_TITLE }).getText().then(function(firstTitle) {
            expect(firstTitle).to.equal(title);
            callback();
        }, callback);
    });
};