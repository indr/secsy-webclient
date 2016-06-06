import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
    createdAt() { return new Date(); },
    accessedAt() { return new Date(); },
    name(i) { return `Person ${i+1}`; },
    emailAddress: 'email@domain.com',
    phoneNumber: null
});
