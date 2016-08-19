# addressbook-webclient Todo

 - [x] Display back button in generate/forgot, login and signup
 - [x] Transform attribute validation errors
 - [ ] Session store as described here: https://github.com/ProtonMail/WebClient/blob/public/src/app/services/storage.js
 - [x] Refactor sha256 from keystore
 - [x] Remove 'Get shares' from navbar and check
   - [x] Add little icon next to user
   - [x] After opening addressbook
   - [x] ~~~Periodically~~~
 - [ ] Add user settings with
   - [ ] Change login password
   - [ ] Change addressbook passphrase
   - [ ] Delete account
 - [x] Share:
   - [x] ~~~Check if contact.me~~~
   - [x] Copy contact details
   - [x] For each contact: get public key, post share
   - [x] Progress bar
 - [x] Remove Ember.ENV.autoCreateMe
   - [x] Set contacts name if empty and me
 - [x] ~~~Embed map with responsive-embed~~~
 - [x] Generate new key loses me contacts email address
   - [x] Create/update me contact after key generation
 - [ ] Translations!
 - [x] Show decryption status
 - [ ] Scrollspy
 - [ ] Fields
 - [ ] Notes with markdown
 - [ ] Don't share empty fields
 - [ ] Undefine session.data.decrypted when session could not be restored
 - [ ] Share with contact without emailAddress throws undefined error
 - [ ] Restore session on subroute => transitions always to /contacts

## Cosmetics

 - [ ] Login/signup/decrypt/generate smaller
 - [x] Flash messages: Generate key should be persistent
 - [ ] Autom. loading of shares should not show success alert
 - [ ] Spin shares loader glyphicon
 - [ ] Determine browsers prefered language
 - [ ] Change 'set on map'
   - [ ] Set pin to center
   - [ ] Open pin with 'Drag me!'
   - [ ] Remove info message
 
