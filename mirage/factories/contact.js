import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  encoded(i) {
    const data = {};
    data['created-at'] = new Date();
    data['accessed-at'] = new Date();
    data['name'] = faker.name.firstName() + ' ' + faker.name.lastName();
    data['email-address'] = faker.internet.email();
    data['phone-number'] = faker.phone.phoneNumber();
    return window.btoa(JSON.stringify(data));
  }
});
