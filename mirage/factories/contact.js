import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
    name(i) { return `Person ${i+1}`; },
    emailAddress: 'email@domain.com',
    phoneNumber: null
});
