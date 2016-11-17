'use strict';

module.exports = function () {
    this.Then(/^the Epam Debrecen page should be opened$/, function () {
        return global.driver.getCurrentUrl().then(function (url) {
            global.expect(url).to.contain('epam-debrecen.blogspot.hu');
        });
    });
};