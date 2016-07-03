export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.2.0-beta.7/shorthands/
  */
  
  this.namespace = 'api';
  this.get('/contacts');
  this.post('/contacts');
  this.get('/contacts/:id');
  this.put('/contacts/:id'); // or this.patch
  this.patch('/contacts/:id');
  this.del('/contacts/:id');

  // http://stackoverflow.com/questions/30954582/how-to-make-ember-cli-mirage-to-work-with-ember-simple-auth
  this.namespace = '';
  this.post('/token', function (db, request) {
    return {
      token: '123abc'
    }
  });
}
