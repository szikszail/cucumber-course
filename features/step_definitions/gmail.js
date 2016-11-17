'use strict';
module.exports = function () {
    var EMAIL_INPUT_SELECTOR = '#Email',
        PWD_INPUT_SELECTOR = '#Passwd',
        NEXT_BUTTON_SELECTOR = '#next',
        LOGIN_BUTTON_SELECTOR = '#signIn',
        SIGN_IN_BUTTON_SELECTOR = '.gmail-nav__nav-link__sign-in',
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
        global.driver.get('http://gmail.com');
        global.driver.waitFor(ABOUT_SELECTOR);
        global.driver.isElementPresent({css: SIGN_IN_BUTTON_SELECTOR}).then(function (present) {
            if (present) {
                global.driver.findElement({css: SIGN_IN_BUTTON_SELECTOR}).click();
                global.driver.waitFor(NEED_HELP_SELECTOR);
            }
        });
        global.driver.findElement({css: EMAIL_INPUT_SELECTOR}).isDisplayed().then(function (displayed) {
            if (displayed) {
                global.driver.findElement({css: EMAIL_INPUT_SELECTOR}).sendKeys('epamdebrecenta');
                global.driver.findElement({css: NEXT_BUTTON_SELECTOR}).click();
                global.driver.waitFor(PWD_INPUT_SELECTOR);
            }
        });
        global.driver.findElement({css: PWD_INPUT_SELECTOR}).sendKeys('Pass1212');
        global.driver.findElement({css: LOGIN_BUTTON_SELECTOR}).click();
        return global.driver.waitFor(getMenuItemSelector('inbox'));
    });

    this.When(/^I click on "([^"]+)" menu item$/, function (menu) {
        global.driver.findElement(getMenuItemSelector(menu)).click();
        return global.driver.waitFor(function () {
            return global.driver.getCurrentUrl().then(function (url) {
                return new RegExp('#' + menu + '$').test(url);
            });
        });
    });

    this.When(/^I click on the result "([^"]+)"$/, function (result) {
        global.driver.findElement(getResultSelector(result)).click();
        return global.driver.waitFor(SUBJECT_HEADER_SELECTOR);
    });

    this.Then(/^the first result should be "([^"]+)"$/, function (title) {
        return global.driver.findElement({xpath: FIRST_RESULT_XPATH}).getText().then(function (text) {
            global.expect(text).to.equal(title);
        });
    });

    this.Then(/^the number of the "([^"]+)" results should be (\d+)$/, function (title, results) {
        return global.driver.findElements({xpath: ALL_RESULTS_XPATH}).then(function (elements) {
            global.expect(elements.length).to.equal(+results);
        });
    });

    this.Then(/^the text "([^"]+)" should be (displayed|hidden)$/, function (text, status) {
        return global.driver.isElementPresent(getElementWithTextSelector(text)).then(function (isPresent) {
            if (isPresent) {
                return global.driver.findElement(getElementWithTextSelector(text)).isDisplayed().then(function (displayed) {
                    global.expect(displayed).to.equal(status === "displayed");
                });
            } else {
                global.expect(false).to.equal(status === "displayed");
            }
        });
    });
};