import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  base64(/*i*/) {
    const data = {};
    data['created-at'] = now();
    data['accessed-at'] = now();
    data['name'] = name();
    data['email-address'] = faker.internet.email();
    data['phone-number'] = faker.phone.phoneNumber();
    return window.btoa(JSON.stringify(data));
  }
});

// export default Factory.extend({
//   createdAt: now,
//   accessedAt: now,
//   name: name,
//   emailAddress: function () {
//     return faker.internet.email();
//   },
//   phoneNumber: function () {
//     return faker.phone.phoneNumber();
//   }
// });

function now() {
  return new Date();
}

function name() {
  return faker.name.firstName() + ' ' + faker.name.lastName();
}
