# addressbook-webclient Todo

 - [ ] "This will erase your addressbook" is shown from cache
 - [ ] Transform attribute validation errors
 - [ ] Session store as described here: https://github.com/ProtonMail/WebClient/blob/public/src/app/services/storage.js
 - [x] Refactor sha256 from keystore
 - [ ] Remove 'Get shares' from navbar and check
   - [ ] After opening addressbook
   - [ ] Periodically
   - [ ] Remove periodicall and use Websockets push
 - [ ] Add user settings with
   - [ ] Change login password
   - [ ] Change addressbook passphrase
   - [ ] Delete account
 - [ ] Share:
   - [ ] Check if contact.me
   - [ ] Copy contact details
   - [ ] For each contact: get public key, post share, call progress
