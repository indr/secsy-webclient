# addressbook-webclient Todo

 - [ ] "This will erase your addressbook" is shown from cache
 - [ ] Transform attribute validation errors
 - [ ] Session store as described here: https://github.com/ProtonMail/WebClient/blob/public/src/app/services/storage.js
 - [x] Refactor sha256 from keystore
 - [ ] Remove 'Get shares' from navbar and check
   - [ ] After opening addressbook
   - [ ] Periodically
   - [ ] Remove periodical and use Websockets push
 - [ ] Add user settings with
   - [ ] Change login password
   - [ ] Change addressbook passphrase
   - [ ] Delete account
 - [ ] Share:
   - [x] ~~~Check if contact.me~~~
   - [x] Copy contact details
   - [x] For each contact: get public key, post share
   - [ ] Progress bar
 - Remove Ember.ENV.autoCreateMe
