/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ValidationErrorsMixinMixin from 'addressbook/mixins/validation-errors-mixin';

describe('ValidationErrorsMixinMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ValidationErrorsMixinObject = Ember.Object.extend(ValidationErrorsMixinMixin);
    let subject = ValidationErrorsMixinObject.create();
    expect(subject).to.be.ok;
  });
});
