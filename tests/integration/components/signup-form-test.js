import { assert } from 'chai';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import instanceInitializer from '../../../instance-initializers/ember-intl';

describeComponent('signup-form', 'Integration | Component | signup form', {
    integration: true,
    setup() {
      // manually invoke the ember-intl initializer
      instanceInitializer.initialize(this);
      let intl = this.container.lookup('service:intl');
      intl.setLocale('en-us');
    }
  },
  function () {
    
    it('it renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      
      this.set('emailAddress', 'user@test.com');
      
      this.render(hbs`{{signup-form}}`);
      
      assert.notEqual(this.$().text().trim(), '');
      
      // Template block usage:
      this.render(hbs`
    {{#signup-form}}
      template block text
    {{/signup-form}}
  `);
      
      assert.notEqual(this.$().text().trim(), 'template block text');
    });
  }
);
