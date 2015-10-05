'use strict';

var expect = require('chai').expect;

module.exports = function() {
    this.World = require('../support/world.js').World;

    this.Given(/^I open Index$/, function (next){
        this.driver.get('http://index.hu');
        this.waitFor('.cimlap');
        next();
    });

    this.Then(/^the Index logo should be (visible|hidden)$/, function (state, next) {
        this.driver.isElementPresent({ css : '.index-header-wrapper a.logo'}).then(function(present){
            expect(present).to.equal(state == 'visible');
            next();
        });
    });
};