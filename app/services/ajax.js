import Ember from 'ember';

export default Ember.Service.extend({
  init() {
    this.adapter = Ember.getOwner(this).lookup('adapter:application');
  },
  
  post(url, data) {
    return this.get('adapter').ajax(url, 'POST', {data: data});
  }
});
