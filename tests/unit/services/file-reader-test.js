/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import { assert } from 'chai';
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';

const FakeFileReader = {
  readAsText: Ember.K
};

describeModule('service:file-reader', 'Unit | Service | FileReaderService', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function () {
    let sut;
    
    beforeEach(function () {
      sut = this.subject();
      sut.fileReaderFactory = () => FakeFileReader;
    });
    
    describe('#importFile', function () {
      const file = {};
      
      it('should resolve with file, content', function () {
        FakeFileReader.readAsText = function () {
          assert.equal(arguments[0], file);
          this.onload({ target: { result: 'FILE CONTENT' } });
        }.bind(FakeFileReader);
        
        return sut.importFile(file).then((result) => {
          assert.equal(result.file, file);
          assert.equal(result.result, 'FILE CONTENT');
        });
      });
      
      it('should reject with error', function () {
        const error = new Error('readAsText error');
        FakeFileReader.readAsText = function () {
          assert.equal(arguments[0], file);
          this.onerror({ target: { error } });
        }.bind(FakeFileReader);
        
        return sut.importFile(file).then(() => {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'readAsText error');
        });
      });
    });
    
    describe('#importFiles', function () {
      const files = [{ name: 'file1' }, { name: 'file2' }];
      
      it('should resolve with array file, content', function () {
        FakeFileReader.readAsText = function (file) {
          this.onload({ target: { result: 'FILE CONTENT OF ' + file.name } });
        }.bind(FakeFileReader);
        
        return sut.importFiles(files).then((result) => {
          assert.isArray(result);
          assert.deepEqual(result[0], { file: { name: 'file1' }, result: 'FILE CONTENT OF file1' });
          assert.deepEqual(result[1], { file: { name: 'file2' }, result: 'FILE CONTENT OF file2' });
        });
      });
      
      it('should reject with error', function () {
        FakeFileReader.readAsText = function (file) {
          if (file.name === 'file2') {
            this.onerror({ target: { error: new Error('file2 error') } })
          } else {
            this.onload({ target: { result: 'FILE CONTENT OF ' + file.name } });
          }
        }.bind(FakeFileReader);
        
        return sut.importFiles(files).then(()=> {
          assert.fail();
        }).catch((error) => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'file2 error');
        });
      });
    });
  }
);
