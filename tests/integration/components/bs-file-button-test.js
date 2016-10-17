/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'bs-file-button',
  'Integration: BsFileButtonComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#bs-file-button}}
      //     template content
      //   {{/bs-file-button}}
      // `);

      this.render(hbs`{{bs-file-button}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
