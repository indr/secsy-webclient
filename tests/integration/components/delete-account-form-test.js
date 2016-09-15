/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'delete-account-form',
  'Integration: DeleteAccountFormComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#delete-account-form}}
      //     template content
      //   {{/delete-account-form}}
      // `);

      this.render(hbs`{{delete-account-form}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
