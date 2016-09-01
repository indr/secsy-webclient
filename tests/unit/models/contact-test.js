import { assert } from 'chai';
import { describeModel, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import uuid from 'ember-simple-uuid';

describeModel('contact', 'Unit | Model | ContactModel', {
    // Specify the other units that are required for this test.
    needs: [
      'validator:presence'
    ]
  },
  function () {
    it('location', function () {
      let sut = this.subject();
      assert.deepEqual(sut.get('location'), null);
      sut.set('location_latitude$', 45);
      assert.deepEqual(sut.get('location'), null);
      sut.set('location_longitude$', 105);
      assert.deepEqual(sut.get('location'), [45, 105]);
      sut.set('location_latitude$', null);
      assert.deepEqual(sut.get('location'), null);
    });
    
    describe('#pushUpdate', function () {
      let sut;
      beforeEach(function () {
        sut = this.subject();
        sut.set('name$', 'User 1');
        sut.set('emailAddress$', 'user1@example.com');
        sut.set('contact_phoneNumber$', '01234');
        sut.set('')
      });
      
      function makeUpdate (decoded) {
        return {
          id: uuid(),
          decoded: decoded || {}
        }
      }
      
      it('should add update to collection', function () {
        let update = makeUpdate();
        sut.pushUpdate(update);
        
        assert.equal(sut.get('updates')[0], update);
        assert.equal(sut.get('updates.length'), 1);
      });
      
      it('should ignore update with same id', function () {
        let update = makeUpdate();
        sut.pushUpdate(update);
        sut.pushUpdate(update);
        
        assert.equal(sut.get('updates')[0], update);
        assert.equal(sut.get('updates.length'), 1);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 0);
      });
      
      it('should set newValuesCount and mergedUpdate according to new values', function () {
        let decoded = {
          contact_phoneNumber$: sut.get('contact_phoneNumber$'),
          internet_skype$: '',
          internet_telegram$: 'new',
          internet_whatsapp$: 'also new'
        };
        sut.pushUpdate({decoded});
        
        assert.equal(sut.get('newValuesCount'), 2);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 2);
      });
      
      it('should not increase newValuesCount given two update with same values', function () {
        const decoded = {
          internet_telegram$: 'new'
        };
        sut.pushUpdate(makeUpdate(decoded));
        sut.pushUpdate(makeUpdate(decoded));
        
        assert.equal(sut.get('updates.length'), 2);
        assert.equal(sut.get('newValuesCount'), 1);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 1);
      });
      
      it('should decrease newValuesCount given second update clears prior updates values', function () {
        sut.pushUpdate(makeUpdate({internet_skype$: 'new'}));
        sut.pushUpdate(makeUpdate({internet_skype$: ''}));
        
        assert.equal(sut.get('updates.length'), 2);
        assert.equal(sut.get('newValuesCount'), 0);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 0);
      });
      
      it('should ignore updates on emailAddress$', function () {
        sut.pushUpdate(makeUpdate({emailAddress$: 'new@example.com'}));
        
        assert.equal(sut.get('updates.length'), 1);
        assert.equal(sut.get('newValuesCount'), 0);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 0);
      });
    });
  }
);
