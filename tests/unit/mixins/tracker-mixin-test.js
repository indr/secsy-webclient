/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import TrackerMixinMixin from 'addressbook/mixins/tracker-mixin';

describe('TrackerMixinMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let TrackerMixinObject = Ember.Object.extend(TrackerMixinMixin);
    let subject = TrackerMixinObject.create();
    expect(subject).to.be.ok;
  });
});
