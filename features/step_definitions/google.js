'use strict';

module.exports = function () {
    var driver = global.driver;
    var expect = global.expect;

    var INPUT_FIELD_SELECTOR = 'input[type="text"][name="q"]',
        FIRST_SEARCH_RESULT = '.srg > .g:first-child',
        FIRST_SEARCH_RESULT_TITLE = FIRST_SEARCH_RESULT + ' > .rc > .r > a';

    this.Given(/^the Google page is opened$/, function () {
        driver.get('http://google.com');
        return driver.waitFor(INPUT_FIELD_SELECTOR);
    });

    this.When(/^the text "([^"]*)" is entered into the search field$/, function (query) {
        driver.findElement({css: INPUT_FIELD_SELECTOR}).sendKeys(query);
        return driver.waitFor(FIRST_SEARCH_RESULT);
    });

    this.When(/^the text "([^"]+)" is clicked$/, function (title) {
        return driver.getCurrentUrl().then(function (prevUrl) {
            driver.findElement({xpath: '//*[@class="r"]/a[normalize-space(.)="' + title + '"]'}).click();
            return driver.waitFor(function () {
                return driver.getCurrentUrl().then(function (url) {
                    return url != prevUrl;
                });
            });
        });
    });

    this.Then(/^the first result is "([^"]+)"$/, function (title) {
        return driver.findElement({css: FIRST_SEARCH_RESULT_TITLE}).getText().then(function (firstTitle) {
            expect(firstTitle).to.equal(title);
        });
    });
};