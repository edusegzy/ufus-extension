var Exception = require('./Exception')
var Store = require('./Store')

module.exports = StoreSync


function StoreSync(ctx, defaults) {
  Store.call(this, ctx, defaults.storePrefix + 'sync:', defaults)
}

StoreSync.prototype = Object.create(Store.prototype)
StoreSync.prototype.constructor = StoreSync

StoreSync.prototype.get = function(key) {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.storage.sync.get(key, function(response) {
      if (self._ctx.chrome.runtime.lastError) {
        return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
      }

      if (response && response[key]) {
        return resolve(response)
      }

      resolve({ [key]: self._defaults[key] })
    })
  })
}

StoreSync.prototype.usage = function(key) {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.storage.sync.getBytesInUse(key, function(bytesInUse) {
      if (self._ctx.chrome.runtime.lastError) {
        return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
      }

      resolve(bytesInUse)
    })
  })
}

StoreSync.prototype.set = function(data) {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.storage.sync.set(data, function(response) {
      if (self._ctx.chrome.runtime.lastError) {
        return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
      }

      resolve(response)
    })
  })
}

StoreSync.prototype.remove = function(key) {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.storage.sync.remove(key, function(response) {
      if (self._ctx.chrome.runtime.lastError) {
        return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
      }

      resolve(response)
    })
  })
}

StoreSync.prototype.clear = function() {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.storage.sync.clear(function(response) {
      if (self._ctx.chrome.runtime.lastError) {
        return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
      }

      resolve(resonse)
    })
  })
}
