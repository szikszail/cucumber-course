'use strict';

module.exports = function () {
    var driver = global.driver;
    var expect = global.expect;

    this.Then(/^the Epam Debrecen page should be opened$/, function () {
        return driver.getCurrentUrl().then(function (url) {
            expect(url).to.contain('epam-debrecen.blogspot.hu');
        });
    });
};