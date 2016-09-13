/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'resend-form',
  'Integration: ResendFormComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#resend-form}}
      //     template content
      //   {{/resend-form}}
      // `);

      this.render(hbs`{{resend-form}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
