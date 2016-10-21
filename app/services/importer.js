/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Service.extend({
  fileReader: Ember.inject.service(),
  store: Ember.inject.service(),
  
  import(files) {
    return this.get('fileReader').importFiles(files).then((files) => {
      let jcards = [];
      for (var i = 0, l = files.length; i < l; i++) {
        jcards = jcards.concat(this.parse(files[i].result));
      }
      return jcards;
    }).then((jcards) => {
      console.log(jcards[0]);
      const vcards = [];
      for (var i = 0, l = jcards.length; i < l; i++) {
        vcards.push(new ICAL.Component(jcards[i]));
      }
      return vcards;
    }).then((vcards) => {
      const store = this.get('store');
      return RSVP.promiseFor(vcards, function condition(vcards) {
        return vcards.length > 0;
      }, function action(vcards) {
        var vcard = vcards.pop();
        // const latLng = vcard.getAllProperties('geo');
        const data = {
          name$: vcard.getFirstPropertyValue('fn'),
          emailAddress$: vcard.getFirstPropertyValue('email'),
          contact_phoneNumber$: vcard.getFirstPropertyValue('tel'),
          contact_website$: vcard.getFirstPropertyValue('url'),
          location_name$: vcard.getFirstPropertyValue('x-location-name'),
          internet_skype$: vcard.getFirstPropertyValue('x-skype'),
          internet_telegram$: vcard.getFirstPropertyValue('x-telegram'),
          internet_whatsapp$: vcard.getFirstPropertyValue('x-whatsapp')
        };
        
        return store.createRecord('contact', data).save().then(() => vcards);
      }, vcards);
    }).then(() => undefined);
  },
  
  parse(input) {
    let jcards = ICAL.parse(input);
    if (jcards && typeof jcards[0] === 'string') {
      return new Array(jcards);
    }
    return jcards;
  }
});
