/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import ENV from 'addressbook/config/environment';
import { before, beforeEach, describe } from 'mocha';

import UndecryptedRouteMixin from 'addressbook/mixins/undecrypted-route-mixin';

const {
  K,
  RSVP
} = Ember;

describeModule('mixin:undecrypted-route-mixin', 'Unit | Mixin | undecrypted route mixin', {
    needs: [],
    
    subject() {
      const Base = Ember.Object.extend({
        beforeModel() {
          return RSVP.resolve({this, arguments});
        },
        transitionTo() {
          return RSVP.resolve({this, arguments});
        }
      });
      const name = 'test-container:undecrypted-route-mixin-object';
      this.register(name, Base.extend(UndecryptedRouteMixin, {}));
      return Ember.getOwner(this).lookup(name);
    }
  },
  function () {
    var sut, keychain, transition;
    
    before(function () {
      assert.isDefined(ENV.APP.routeIfAlreadyDecrypted, 'You must define ENV.APP.routeIfAlreadyDecrypted');
    });
    
    beforeEach(function () {
      this.register('service:keychain', Ember.Object.extend());
      keychain = Ember.getOwner(this).lookup('service:keychain');
      transition = {abort: K};
      sut = this.subject();
    });
    
    describe('#beforeModel | keychain is not open', function () {
      it('should resolve supers promise', function () {
        keychain.isOpen = false;
        
        return sut.beforeModel(transition).then((result) => {
          assert.equal(result.this, sut);
          assert.equal(result.arguments[0], transition);
        });
      });
    });
    
    describe('#beforeModel | keychain is open', function () {
      beforeEach(function () {
        keychain.isOpen = true;
      });
      
      it('should assert that routeIfAlreadyDecrypted is not equal this route', function () {
        sut.set('routeName', ENV.APP.routeIfAlreadyDecrypted);
        
        try {
          sut.beforeModel(transition);
          assert(false, 'Expected exception to be thrown but there was none');
        } catch (error) {
          assert.instanceOf(error, Error);
          assert.match(error.message, /The route configured as/);
        }
      });
      
      it('should abort current transition and start a new transition to routeIfAlreadyDecrypted', function () {
        var aborted = false;
        var transition = {
          abort: () => aborted = true
        };
        
        var transitionToRoute = null;
        sut.transitionTo = (route) => {
          transitionToRoute = route;
        };
        
        sut.beforeModel(transition);
        
        assert.isTrue(aborted, 'Current transition was not aborted');
        assert.equal(transitionToRoute, ENV.APP.routeIfAlreadyDecrypted, 'Did not transition to routeIfAlreadyDecrypted');
      });
    });
  }
);
