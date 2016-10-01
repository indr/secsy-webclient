/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import FlashObject from 'ember-cli-flash/flash/object';

const { K } = Ember;

FlashObject.reopen({ init: K });
