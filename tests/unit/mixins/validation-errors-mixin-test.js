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

import ValidationErrorsMixin from 'secsy-webclient/mixins/validation-errors-mixin';

// Testing Ember.js Mixins With a Container
// http://www.chriskrycho.com/2016/testing-emberjs-mixins-with-a-container.html

describeModule('mixin:validation-errors-mixin', 'Unit | Mixin | validation errors mixin', {
    needs: [],
    
    subject() {
      const name = 'test-container:validation-errors-mixin-object';
      this.register(name, Ember.Object.extend(ValidationErrorsMixin));
      return Ember.getOwner(this).lookup(name);
    }
  },
  function () {
    
    it('works', function () {
      const sut = this.subject();
      assert.ok(sut);
    });
  }
);
