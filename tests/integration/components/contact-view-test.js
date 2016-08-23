/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'contact-view',
  'Integration: ContactViewComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#contact-view}}
      //     template content
      //   {{/contact-view}}
      // `);

      this.render(hbs`{{contact-view}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
