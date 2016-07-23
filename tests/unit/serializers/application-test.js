import {moduleForModel, test, skip} from 'ember-qunit';

// The blueprint of this file doesn't work.
// https://github.com/ember-cli/ember-cli/issues/4879

//moduleForModel('application', 'Unit | Serializer | application', {
moduleForModel('contact', 'Unit | Serializer | application', {
  // Specify the other units that are required for this test.
  needs: ['serializer:application']
});

// Replace this with your real tests.
test('it serializes records', function (assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});

test('ember-qunit does not provide a skip function', function (assert) {
  // If this test fails, ember-qunit has finally caught up with qunit!
  assert.equal(skip, undefined);
});
