'use strict';

var expect = require('chai').expect;

module.exports = function() {

    this.World = require('../support/world.js').World;

    var INPUT_FIELD_SELECTOR = 'input[type="text"][name="q"]',
        FIRST_SEARCH_RESULT = '.srg > .g:first-child',
        FIRST_SEARCH_RESULT_TITLE = FIRST_SEARCH_RESULT + ' > .rc > .r > a';

    this.Given(/^the Google page is opened$/, function () {
        this.driver.get('http://google.com');
        return this.waitFor(INPUT_FIELD_SELECTOR);
    });

    this.When(/^the text "([^"]*)" is entered into the search field$/, function (query) {
        this.driver.findElement({ css: INPUT_FIELD_SELECTOR }).sendKeys(query);
        return this.waitFor(FIRST_SEARCH_RESULT);
    });

    this.When(/^the text "([^"]+)" is clicked$/, function (title) {
        var self = this;
        var prevUrl = this.driver.getCurrentUrl();
        this.driver.findElement({ xpath: '//*[@class="r"]/a[normalize-space(.)="' + title + '"]' }).click();
        return this.waitFor(function(){
            return self.driver.getCurrentUrl().then(function(url){
                return url != prevUrl;
            });
        });
    });

    this.Then(/^the first result is "([^"]+)"$/, function (title, callback) {
        this.driver.findElement({ css: FIRST_SEARCH_RESULT_TITLE }).getText().then(function(firstTitle) {
            expect(firstTitle).to.equal(title);
            callback();
        }, callback);
    });
};