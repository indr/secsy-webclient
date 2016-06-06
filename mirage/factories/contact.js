import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    createdAt() { return new Date(); },
    accessedAt() { return new Date(); },
    name(i) { return faker.name.firstName() + ' ' + faker.name.lastName(); },
    emailAddress: faker.internet.email,
    phoneNumber() { return faker.phone.phoneNumber(); }
});
