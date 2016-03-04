'use strict';

var expect = require('chai').expect;

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.Then(/^the Epam Debrecen page should be opened$/, function (callback) {
        this.driver.getCurrentUrl().then(function (url) {
            expect(url).to.contain('epam-debrecen.blogspot.hu');
            callback();
        }, callback);
    });
};