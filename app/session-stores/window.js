import Ember from 'ember';
import Base from 'ember-simple-auth/session-stores/base';

const {
  RSVP
} = Ember;

export default Base.extend({
  window: window,
  
  persist(data) {
    try {
      this.window.name = JSON.stringify(data || {});
      return RSVP.resolve();
    } catch (error) {
      return RSVP.reject(error);
    }
  },
  
  restore() {
    try {
      const data = this.window.name ? JSON.parse(this.window.name) : {};
      return RSVP.resolve(data);
    } catch (error) {
      return RSVP.reject(error);
    }
  },
  
  clear() {
    try {
      this.window.name = null;
      return RSVP.resolve();
    } catch (error) {
      return RSVP.reject(error);
    }
  }
})
