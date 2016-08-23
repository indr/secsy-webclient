/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'contact-share-form',
  'Integration: ContactShareFormComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#contact-share-form}}
      //     template content
      //   {{/contact-share-form}}
      // `);

      this.render(hbs`{{contact-share-form}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
