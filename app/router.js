import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  rootUrl: config.rootUrl,
  location: config.locationType
});

Router.map(function () {
  this.route('contacts', function () {
    this.route('new');
    this.route('view', {path: '/:id'});
    this.route('edit', {path: '/:id/edit'});
    this.route('review', {path: '/:id/review'});
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
  this.route('preferences', function() {
    this.route('delete-account');
    this.route('change-passphrase');
  });
  this.route('activate', {path: '/activate/:token'});
  this.route('resend');
  this.route('forgot-password');
  this.route('reset-password', {path: '/password-reset/:token'});
});

export default Router;
