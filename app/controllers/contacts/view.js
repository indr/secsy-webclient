import Ember from 'ember';
import TrackerMixin from './../../mixins/tracker-mixin';

export default Ember.Controller.extend(TrackerMixin, {
  session: Ember.inject.service(),
  
  // Ugly as hell, but the easiest way the retrieve the state from contacts.share
  shareState: Ember.computed('session.data.updatePusherState', function () {
    return this.get('session.data.updatePusherState');
  })
});
