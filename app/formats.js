/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

export default {
  time: {
    hhmmss: {
      hour:   'numeric',
      minute: 'numeric',
      second: 'numeric'
    }
  },
  date: {
    hhmmss: {
      hour:   'numeric',
      minute: 'numeric',
      second: 'numeric'
    }
  },
  number: {
    EUR: {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    USD: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  }
};
