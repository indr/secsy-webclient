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
  it,
  beforeEach
} from 'mocha';
import Ember from 'ember';
import { initialize } from 'secsy-webclient/initializers/load-extensions';

describe('LoadExtensionsInitializer', function() {
  let container, application;

  beforeEach(function() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  });

  // Replace this with your real tests.
  it('works', function() {
    initialize(container, application);

    // you would normally confirm the results of the initializer here
    expect(true).to.be.ok;
  });
});
