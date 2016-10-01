/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    'ember-bootstrap': {
      'importBootstrapTheme': false,
      'importBootstrapCSS': false
    }
  });
  
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  
  app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
  
  app.import({test: 'bower_components/simple-mock/index.js'});
  app.import({test: 'vendor/shims/simple-mock.js'}, {
    exports: {
      'simple-mock': ['default']
    }
  });
  
  app.import('bower_components/fakerator/dist/fakerator.min.js');
  app.import('vendor/shims/fakerator.js', {
    exports: {
      'Fakerator': ['default']
    }
  });
  
  return app.toTree();
};
