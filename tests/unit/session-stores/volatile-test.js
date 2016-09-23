import { assert } from 'chai';
import { describeModule, it } from 'ember-mocha';
import { after, beforeEach, describe } from 'mocha';
import simple from 'simple-mock';
import utils from 'addressbook/session-stores/utils';

import ENV from 'addressbook/config/environment';

const globalWindow = window;

describeModule('session-store:volatile', 'Unit | Session store | volatile', {},
  function () {
    let config, sut, window, addEventListener, attachEvent;
    
    after(function () {
      utils.window = globalWindow;
    });
    
    beforeEach(function () {
      config = ENV['volatileStore'] = {};
      window = {name: null};
      addEventListener = simple.mock(window, 'addEventListener');
      attachEvent = simple.mock(window, 'attachEvent');
      utils.window = window;
    });
    
    describe('#init', function () {
      it('should clear window.name', function () {
        window.name = '"a string"';
        
        sut = this.subject();
        
        assert.isNull(window.name);
      });
      
      it('should not throw if window is not available', function () {
        utils.window = undefined;
        
        this.subject();
      });
      
      it('should add event listener to unload', function () {
        this.subject();
        
        assert.isTrue(addEventListener.called);
        const args = addEventListener.lastCall.args;
        assert.equal(args[0], 'unload');
        assert.equal(args[1].name, 'flush');
        assert.equal(args[2], false);
      });
      
      it('should attach event given addEventListener is undefined', function () {
        delete window.addEventListener;
        
        this.subject();
        
        assert.isTrue(attachEvent.called);
        const args = attachEvent.lastCall.args;
        assert.equal(args[0], 'onunload');
        assert.equal(args[1].name, 'flush');
      });
    });
    
    describe('#restore after #init', function () {
      it('should return an empty object given window.name is null', function (done) {
        window.name = null;
        sut = this.subject();
        
        sut.restore().then((data) => {
          assert.deepEqual(data, {});
          done();
        });
      });
      
      it('should return an empty object given window.name contains arbitray data', function (done) {
        window.name = 'a | windows / name';
        sut = this.subject();
        
        sut.restore().then((data) => {
          assert.deepEqual(data, {});
          done();
        });
      });
      
      it('should be able to restore a string', function (done) {
        window.name = '"a string"';
        
        sut = this.subject();
        
        sut.restore().then((data) => {
          assert.equal(data, 'a string');
          done();
        });
      });
      
      it('should be able to restore a number', function (done) {
        window.name = '5.11';
        
        sut = this.subject();
        
        sut.restore().then((data) => {
          assert.equal(data, 5.11);
          done();
        });
      });
      
      it('should be able to restore an object', function (done) {
        window.name = JSON.stringify({s: 's1', o1: {o1s: 'o1s', o1n: 5.11}});
        
        sut = this.subject();
        
        sut.restore().then((data) => {
          assert.deepEqual(data, {s: 's1', o1: {o1s: 'o1s', o1n: 5.11}});
          done();
        });
      });
      
      it('should restore only whitelisted object properties', function (done) {
        config.whitelist = ['ok1', 'obj.ok2'];
        window.name = JSON.stringify({no1: 'no1', ok1: 'ok1'});
        
        sut = this.subject();
        
        sut.restore().then((data) => {
          assert.deepEqual(data, {ok1: 'ok1'});
          done();
        });
      });
    });
    
    describe('#persist', function () {
      it('should not touch window.name', function (done) {
        window.name = 'untouched';
        
        sut.persist('a string').then(() => {
          assert.equal(window.name, 'untouched');
          done();
        });
      });
    });
    
    describe('#restore after #persist', function () {
      it('should be able to persist and restore a string', function (done) {
        sut = this.subject();
        
        sut.persist('a string').then(() => {
          return sut.restore();
        }).then((data) => {
          assert.equal(data, 'a string');
          done();
        });
      });
      
      it('should be able to persist and restore a number', function (done) {
        sut = this.subject();
        
        sut.persist(5.11).then(() => {
          return sut.restore();
        }).then((data) => {
          assert.equal(data, 5.11);
          done();
        });
      });
      
      it('should be able to persist and restore an object', function (done) {
        sut = this.subject();
        
        sut.persist({s: 's1', o1: {o1s: 'o1s', o1n: 5.11}}).then(() => {
          return sut.restore();
        }).then((data) => {
          assert.deepEqual(data, {s: 's1', o1: {o1s: 'o1s', o1n: 5.11}});
          done();
        });
      });
      
      it('should only persist and restore whitelisted object properites', function (done) {
        config.whitelist = ['s'];
        sut = this.subject();
        
        sut.persist({s: 's1', o1: {o1s: 'o1s', o1n: 5.11}}).then(() => {
          return sut.restore();
        }).then((data) => {
          assert.deepEqual(data, {s: 's1'});
          done();
        });
      });
    });
    
    describe('#clear', function () {
      it('should set not touch window.name', function (done) {
        window.name = 'untouched';
        
        sut.clear().then(() => {
          assert.equal(window.name, 'untouched');
          done();
        });
      });
    });
    
    describe('#restore after #clear', function () {
      it('should clear values loaded with #init', function (done) {
        window.name = '"a string"';
        sut = this.subject();
        
        sut.restore().then((data) => {
          assert.equal(data, 'a string');
          return sut.clear();
        }).then(() => {
          return sut.restore();
        }).then((data) => {
          assert.deepEqual(data, {});
          done();
        });
      });
      
      it('should clear values loaded with #persist', function (done) {
        sut = this.subject();
        
        sut.persist('a string').then(() => {
          return sut.clear();
        }).then(() => {
          return sut.restore();
        }).then((data) => {
          assert.deepEqual(data, {});
          done();
        });
      });
    });
    
    describe('#flush', function () {
      it('should reject with TypeError given window is not available', function () {
        sut = this.subject();
        utils.window = null;
        
        try {
          sut.flush();
          assert.fail();
        } catch (error) {
          assert.equal(error.name, 'TypeError');
        }
      });
      
      it('should save data to window.name', function (done) {
        sut = this.subject();
        
        sut.persist('a string').then(() => {
          sut.flush();
          assert.equal(window.name, '"a string"');
          done();
        });
      });
      
      it('should only save whitlisted object properites to window.name', function (done) {
        config.whitelist = ['s'];
        sut = this.subject();
        
        sut.persist({s: 's1', o1: {o1s: 'o1s', o1n: 5.11}}).then(() => {
          sut.flush();
          assert.equal(window.name, '{"s":"s1"}');
          done();
        });
      });
    });
    
    describe('flush on window unload', function () {
      it('should flush when window.unload is fired', function () {
        window.name = null;
        this.subject();
        
        addEventListener.lastCall.args[1]();
        
        assert.notEqual(window.name, null);
      });
      
      it('should flush when window.onunload is fired', function () {
        window.name = null;
        delete window.addEventListener;
        this.subject();
        
        attachEvent.lastCall.args[1]();
        
        assert.notEqual(window.name, null);
      });
    });
  }
);
