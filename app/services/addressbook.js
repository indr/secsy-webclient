import Ember from 'ember';
import fakerator from 'Fakerator';

const {
  K,
  RSVP
} = Ember;

export default Ember.Service.extend({
  intl: Ember.inject.service(),
  store: Ember.inject.service(),
  
  clear(progress) {
    progress = progress || K;
    
    const store = this.get('store');
    var status = {
      max: 1,
      value: 0
    };
    
    progress(status);
    return store.findAll('contact').then(function (contacts) {
      const result = contacts.toArray();
      status.max = result.length;
      progress(status);
      return result;
    }).then(function (contacts) {
      return RSVP.promiseFor(null, function condition(contacts) {
        return contacts.length > 0;
      }, function action(contacts) {
        var contact = contacts.pop();
        
        status.value++;
        if (contact.get('me')) {
          progress(status);
          return RSVP.resolve(contacts);
        }
        return contact.destroyRecord().then(() => {
          progress(status);
          return contacts;
        }).catch((err) => {
          status.err = err;
          progress(status);
          return contacts;
        });
      }, contacts);
    });
  },
  
  fake(progress) {
    progress = progress || K;
    
    var locale = this.get('intl.locale')[0].split('-').map(function (value, index) {
      return index === 0 ? value.toLowerCase() : value.toUpperCase();
    }).join('-');
    
    const store = this.get('store');
    const fake = fakerator(locale);
    const number = number || fake.random.number(5, 20);
    
    var status = {
      max: number,
      value: 0
    };
    
    progress(status);
    return RSVP.promiseFor(null, function condition(number) {
      return number > 0;
    }, function action(number) {
      const firstName = fake.names.firstName();
      const lastName = fake.names.lastName();
      const location = fake.address.geoLocation();
      const data = {
        name$: firstName + ' ' + lastName,
        phoneNumber$: fake.phone.number(),
        emailAddress$: fake.internet.email(firstName, lastName),
        latitude$: location.latitude,
        longitude$: location.longitude
      };
      
      return store.createRecord('contact', data).save().then(() => {
        return number - 1;
      }).catch((err) => {
        status.err = err;
        return number - 1;
      }).finally(() => {
        status.value++;
        progress(status);
        // finally() doesn't affect the return value (!)
        // return number - 1;
      });
    }, number);
  }
});
