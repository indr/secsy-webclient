import Ember from 'ember';

export default Ember.Service.extend({
  init() {
    this.adapter = Ember.getOwner(this).lookup('adapter:application');
  },
  
  delete(url, data) {
    return this.ajax(url, 'DELETE', data)
  },
  
  post(url, data) {
    return this.ajax(url, 'POST', data);
  },
  
  ajax(url, type, data){
    return this.get('adapter').ajax(url, type, {data: data});
  }
});
