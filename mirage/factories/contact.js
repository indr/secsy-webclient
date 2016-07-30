import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  createdAt: now,
  accessedAt: now,
  name: name,
  encrypted: function encrypted() {
    var plain = {
      emailAddress: function () {
        return faker.internet.email();
      },
      phoneNumber: function () {
        return faker.phone.phoneNumber();
      }
    };
    
    Object.keys(plain).forEach((key) => {
      if (typeof plain[key] === 'function') {
        plain[key] = plain[key]();
      }
    });
    
    return window.btoa(JSON.stringify(plain));
  }
});

function now() {
  return new Date();
}

function name() {
  return faker.name.firstName() + ' ' + faker.name.lastName();
}
