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
  describeModule,
  it
} from 'ember-mocha';

describeModule(
  'service:session',
  'SessionService',
  {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      let service = this.subject();
      expect(service).to.be.ok;
    });
  }
);
