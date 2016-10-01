/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  createdAt: now,
  accessedAt: now,
  'encrypted_': function encrypted() {
    var plain = {
      name$: name,
      emailAddress$: function () {
        return faker.internet.email();
      },
      phoneNumber$: function () {
        return faker.phone.phoneNumber();
      },
      latitude$: function () {
        return faker.address.latitude();
      },
      longitude$: function () {
        return faker.address.longitude();
      }
    };
    
    Object.keys(plain).forEach((key) => {
      if (typeof plain[key] === 'function') {
        plain[key] = plain[key]();
      }
    });
    
    return {
      algorithm: 'base64',
      data: window.btoa(JSON.stringify(plain))
    };
  }
});

function now() {
  return new Date();
}

function name() {
  return faker.name.firstName() + ' ' + faker.name.lastName();
}
