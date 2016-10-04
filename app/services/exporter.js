/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

function addProperty (name, value) {
  if (value === undefined) {
    return;
  }
  this.addPropertyWithValue(name, value);
}

export default Ember.Service.extend({
  contactTovCard3(contact) {
    const vcard = new ICAL.Component('vcard3');
    const add = addProperty.bind(vcard);
    
    add('version', '3.0');
    
    let fn = contact.get('name$');
    add('fn', fn);
    
    fn = fn.split(' ');
    let n = ['', '', '', '', ''];
    if (fn.length === 1) {
      n[0] = fn[0];
    } else if (fn.length === 2) {
      n[0] = fn[1];
      n[1] = fn[0];
    } else if (fn.length >= 3) {
      n[1] = fn[0];
      n[2] = fn[1];
      n[0] = fn.slice(2).join(' ');
    }
    
    add('n', n);
    add('url', contact.get('contact_website$'));
    add('note', contact.get('contact_notes$'));
    add('email', contact.get('emailAddress$'));
    add('tel', contact.get('contact_phoneNumber$'));
    
    add('x-location-name', contact.get('location_name$'));
    var latLng = contact.get('location');
    if (latLng) {
      add('geo', latLng.join(','));
    }
    
    add('x-skype', contact.get('internet_skype$'));
    add('x-telegram', contact.get('internet_telegram$'));
    add('x-whatsapp', contact.get('internet_whatsapp$'));
    
    return vcard.toString().replace(/^(BEGIN|END):VCARD3$/gm, '$1:VCARD');
  }
});
