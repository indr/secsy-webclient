import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import instanceInitializer from '../../../instance-initializers/ember-intl';

moduleForComponent('decrypt-form', 'Integration | Component | decrypt form', {
  integration: true,
  setup() {
    // manually invoke the ember-intl initializer
    instanceInitializer.initialize(this);
    let intl = this.container.lookup('service:intl');
    intl.setLocale('en-us');
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{decrypt-form}}`);

  assert.notEqual(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#decrypt-form}}
      template block text
    {{/decrypt-form}}
  `);

  assert.notEqual(this.$().text().trim(), 'template block text');
});
