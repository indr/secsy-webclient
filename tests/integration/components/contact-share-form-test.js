import { expect } from 'chai';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import instanceInitializer from '../../../instance-initializers/ember-intl';

describeComponent('contact-share-form', 'Integration: ContactShareFormComponent', {
    integration: true,
    setup() {
      // manually invoke the ember-intl initializer
      instanceInitializer.initialize(this);
      let intl = this.container.lookup('service:intl');
      intl.setLocale('en-us');
    }
  },
  function () {
    // TODO: How to set model which is used in init()?
    it.skip('renders', function () {
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
