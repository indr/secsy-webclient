import Ember from 'ember';
import fakerator from 'Fakerator';

const {
  K,
  RSVP
} = Ember;

export default Ember.Service.extend({
  intl: Ember.inject.service(),
  store: Ember.inject.service(),
  cache: {},
  
  
  findContacts(options) {
    options = Ember.merge({cache: true}, options);
    let modelName = 'contact';
    
    if (options.cache && this.cache[modelName]) {
      return RSVP.resolve(this.cache[modelName]);
    }
    
    return this.get('store').findAll(modelName).then((results) => {
      this.cache[modelName] = results;
      return results;
    });
  },
  
  findContactBy(key, value) {
    return this.findContacts().then((contacts) => {
      return contacts.findBy(key, value);
    });
  },
  
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
      return RSVP.promiseFor(null, function condition (contacts) {
        return contacts.length > 0;
      }, function action (contacts) {
        var contact = contacts.pop();
        
        status.value++;
        const stateName = contact.get('currentState.stateName');
        if (contact.get('me') || contact.get('inFlight')) {
          progress(status);
          return RSVP.resolve(contacts);
        }
        return contact.destroyRecord().then(() => {
          progress(status);
          return contacts;
        }).catch(() => {
          console.log('Error destroying, state was ' + stateName);
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
    const number = number || fake.random.number(30, 50);
    
    var status = {
      max: number,
      value: 0
    };
    
    progress(status);
    return RSVP.promiseFor(null, function condition (number) {
      return number > 0;
    }, function action (number) {
      const firstName = fake.names.firstName();
      const lastName = fake.names.lastName();
      const location = fake.address.geoLocation();
      const data = {
        createdAt: fake.date.past(),
        updatedAt: fake.date.recent(),
        name$: firstName + ' ' + lastName,
        emailAddress$: fake.internet.email(firstName, lastName),
        contact_phoneNumber$: fake.phone.number(),
        location_name$: fake.address.country(),
        location_latitude$: location.latitude,
        location_longitude$: location.longitude
      };
      
      return RSVP.resolve(store.createRecord('contact', data)).then(() => {
        return new RSVP.Promise((resolve) => {
          Ember.run.later(() => {
            resolve(number - 1);
          }, 200);
        });
      }).catch(() => {
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
