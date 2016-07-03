import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('contacts', function() {
    this.route('new');
    this.route('view', { path: '/:id'});
    this.route('edit', { path: '/:id/edit'});
  });
  this.route('login');
  this.route('decrypt');
});

export default Router;
