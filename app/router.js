import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('contacts', function () {
    this.route('new');
    this.route('view', {path: '/:id'});
    this.route('edit', {path: '/:id/edit'});
    this.route('share', {path: '/:id/share'});
  });
  this.route('decrypt');
  this.route('login');
  this.route('signup');
  this.route('map', function () {
    this.route('view', {path: '/:id'});
  });
  this.route('generate');
  this.route('index', {path: '/*wildcard'});
  this.route('index', {path: '/'});
  this.route('preferences');
});

export default Router;
