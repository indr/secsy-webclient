/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
import {describeModel, it, skip} from 'ember-mocha';

// The blueprint of this file doesn't work.
// https://github.com/ember-cli/ember-cli/issues/4879

//describeModel('application', 'Unit | Serializer | application', {
describeModel('contact', 'Unit | Serializer | application', {
  // Specify the other units that are required for this test.
  needs: ['serializer:application']
  },
  function () {

// Replace this with your real tests.
it('it serializes records', function () {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});

it('ember-qunit does not provide a skip function', function () {
  // If this test fails, ember-qunit has finally caught up with qunit!
  assert.equal(skip, undefined);
});
});
