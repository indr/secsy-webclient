# addressbook-webclient Todo

 - [x] Display back button in generate/forgot, login and signup
 - [x] Transform attribute validation errors
 - [ ] Session store as described here: https://github.com/ProtonMail/WebClient/blob/public/src/app/services/storage.js
 - [x] Refactor sha256 from keystore
 - [x] Remove 'Get shares' from navbar and check
   - [x] Add little icon next to user
   - [x] After opening addressbook
   - [x] ~~~Periodically~~~
 - [ ] Add user preferences with
   - [ ] Change login password (send reset link?)
   - [ ] Change addressbook passphrase (send reset link?)
   - [ ] Delete account
   - [x] Clean addressbook
   - [x] Generate fakes
 - [x] Share:
   - [ ] Check if contact.me
   - [x] Copy contact details
   - [x] For each contact: get public key, post share
   - [x] Progress bar
 - [x] Remove Ember.ENV.autoCreateMe
   - [x] Set contacts name if empty and me
 - [x] ~~~Embed map with responsive-embed~~~
 - [x] Generate new key loses me contacts email address
   - [x] Create/update me contact after key generation
 - [x] Show decryption status
 - [x] Undefine session.data.isDecrypted when session could not be restored
  - [x] Trigger sessionDataInvalidated => session.isDecrypted
 - [x] Share with contact without emailAddress throws undefined error
 - [x] Restore session on subroute => transitions always to /contacts
 - [x] How to handle ajax errors 403s?
   - [x] Login, decrypt, open contact, reject session, login another user, 403 get contacts/abc123
         No transition away from /decrypt
   - [x] ~~~DS.RESTAdapters feature flag for Error classes~~~
 - [x] How to handle invalid route errors?
 - [x] jQuery ajax timeout?
 - [x] Show contact cards in contacts.index
   - [x] Group by first letter
   - [x] Affix letter navigation
 - [x] Don't share empty fields
 - [x] Translations
 - [x] More fields
   - [x] Social
   - [x] IMs and VoIP
 - [x] Loading screen
 - [ ] TODO: Error handling\??
 - [x] Grouping shows deleted.saved records? => willTransition()!!!
 - [ ] Search
 - [x] Set on map asks for saving pending changes
 - [ ] Navbar
   - [ ] Search icon
   - [ ] Map icon
   - [ ] Responsive: User, Preferences, Logout
 - [x] Show warning on login and generate key

## Cosmetics

 - [ ] Remove ember-cli-filterby-query if not used anymore
 - [ ] Notes with markdown
 - [ ] autofocus
 - [x] Login/signup/decrypt/generate narrower
 - [x] Flash messages: Generate key should be persistent
 - [x] Autom. loading of shares should not show success alert
 - [ ] Spin shares loader glyphicon
 - [ ] Determine browsers prefered language
 - [ ] Change 'set on map'
   - [ ] Set pin to center
   - [ ] Open pin with 'Drag me!'
   - [ ] Remove info message
   
## Contributions

 - [ ] ember-cli-simple-mock-shim
 
