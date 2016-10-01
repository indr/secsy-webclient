/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import instanceInitializer from '../../../instance-initializers/ember-intl';

describeComponent('contacts-filter', 'Integration | Component | contacts filter', {
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
      
      this.render(hbs`{{contacts-filter}}`);
      
      assert.equal(this.$().text().trim(), '');
      
      // Template block usage:
      this.render(hbs`
    {{#contacts-filter}}
      template block text
    {{/contacts-filter}}
  `);
      
      assert.notEqual(this.$().text().trim(), 'template block text');
    });
  }
);
