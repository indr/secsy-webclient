/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

/* jshint node: true */

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'secsy-webclient',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      decryptionRoute: 'decrypt',
      routeAfterDecryption: 'contacts',
      routeIfAlreadyDecrypted: 'contacts',
      
      useWebWorker: false
    }
  };
  
  ENV['secure-store'] = {
    persistent: 'localeName'
  };
  
  ENV['ember-simple-auth'] = {
    authenticationRoute: 'login',
    routeAfterAuthentication: 'decrypt',
    routeIfAlreadyAuthenticated: 'decrypt'
  };
  
  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }
  
  if (environment === 'test') {
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';
    
    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    
    ENV.APP.rootElement = '#ember-testing';
  }
  
  if (environment === 'production') {
    ENV.rootURL = '/app/';
  }
  
  return ENV;
};
