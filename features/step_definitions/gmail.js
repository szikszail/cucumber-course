'use strict';
module.exports = function () {
    var EMAIL_INPUT_SELECTOR = '#Email',
        PWD_INPUT_SELECTOR = '#Passwd',
        NEXT_BUTTON_SELECTOR = '#next',
        LOGIN_BUTTON_SELECTOR = '#signIn',
        SIGN_IN_BUTTON_SELECTOR = '#gmail-sign-in',
        SUBJECT_HEADER_SELECTOR = 'h2.hP',
        NEED_HELP_SELECTOR = '.need-help',
        ABOUT_SELECTOR = 'a[href*="about"]',
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

    this.Given(/^I login to my gmail account$/, function () {
        var self = this;
        driver.get('http://gmail.com');
        driver.waitFor(ABOUT_SELECTOR);
        driver.isElementPresent({css: SIGN_IN_BUTTON_SELECTOR}).then(function (present) {
            if (present) {
                driver.findElement({css: SIGN_IN_BUTTON_SELECTOR}).click();
                driver.waitFor(NEED_HELP_SELECTOR);
            }
        });
        driver.findElement({css: EMAIL_INPUT_SELECTOR}).isDisplayed().then(function (displayed) {
            if (displayed) {
                driver.findElement({css: EMAIL_INPUT_SELECTOR}).sendKeys('epamdebrecenta');
                driver.findElement({css: NEXT_BUTTON_SELECTOR}).click();
                driver.waitFor(PWD_INPUT_SELECTOR);
            }
        });
        driver.findElement({css: PWD_INPUT_SELECTOR}).sendKeys('Pass1212');
        driver.findElement({css: LOGIN_BUTTON_SELECTOR}).click();
        return driver.waitFor(getMenuItemSelector('inbox'));
    });

    this.When(/^I click on "([^"]+)" menu item$/, function (menu) {
        driver.findElement(getMenuItemSelector(menu)).click();
        return driver.waitFor(function () {
            return driver.getCurrentUrl().then(function (url) {
                return new RegExp('#' + menu + '$').test(url);
            });
        });
    });

    this.When(/^I click on the result "([^"]+)"$/, function (result) {
        driver.findElement(getResultSelector(result)).click();
        return driver.waitFor(SUBJECT_HEADER_SELECTOR);
    });

    this.Then(/^the first result should be "([^"]+)"$/, function (title) {
        return driver.findElement({xpath: FIRST_RESULT_XPATH}).getText().then(function (text) {
            expect(text).to.equal(title);
        });
    });

    this.Then(/^the number of the "([^"]+)" results should be (\d+)$/, function (title, results) {
        return driver.findElements({xpath: ALL_RESULTS_XPATH}).then(function (elements) {
            expect(elements.length).to.equal(+results);
        });
    });

    this.Then(/^the text "([^"]+)" should be (displayed|hidden)$/, function (text, status) {
        return driver.isElementPresent(getElementWithTextSelector(text)).then(function (isPresent) {
            if (isPresent) {
                return driver.findElement(getElementWithTextSelector(text)).isDisplayed().then(function (displayed) {
                    expect(displayed).to.equal(status === "displayed");
                });
            } else {
                expect(false).to.equal(status === "displayed");
            }
        });
    });
};