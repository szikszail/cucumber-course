'use strict';

module.exports = function () {
    var INPUT_FIELD_SELECTOR = 'input[type="text"][name="q"]',
        FIRST_SEARCH_RESULT = '.srg > .g:first-child',
        FIRST_SEARCH_RESULT_TITLE = FIRST_SEARCH_RESULT + ' > .rc > .r > a';

    this.Given(/^the Google page is opened$/, function () {
        global.driver.get('http://google.com');
        return global.driver.waitFor(INPUT_FIELD_SELECTOR);
    });

    this.When(/^the text "([^"]*)" is entered into the search field$/, function (query) {
        global.driver.findElement({css: INPUT_FIELD_SELECTOR}).sendKeys(query);
        return global.driver.waitFor(FIRST_SEARCH_RESULT);
    });

    this.When(/^the text "([^"]+)" is clicked$/, function (title) {
        return global.driver.getCurrentUrl().then(function (prevUrl) {
            global.driver.findElement({xpath: '//*[@class="r"]/a[normalize-space(.)="' + title + '"]'}).click();
            return global.driver.waitFor(function () {
                return global.driver.getCurrentUrl().then(function (url) {
                    return url != prevUrl;
                });
            });
        });
    });

    this.Then(/^the first result is "([^"]+)"$/, function (title) {
        return global.driver.findElement({css: FIRST_SEARCH_RESULT_TITLE}).getText().then(function (firstTitle) {
            global.expect(firstTitle).to.equal(title);
        });
    });
};