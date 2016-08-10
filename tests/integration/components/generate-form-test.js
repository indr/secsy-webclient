/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'generate-form',
  'Integration: GenerateFormComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#generate-form}}
      //     template content
      //   {{/generate-form}}
      // `);

      this.render(hbs`{{generate-form}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
