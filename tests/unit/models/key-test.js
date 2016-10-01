/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
import { describeModel, it } from 'ember-mocha';

describeModel('key', 'Unit | Model | public key', {
  // Specify the other units that are required for this test.
  needs: []
  },
  function () {

it('it exists', function () {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
});
