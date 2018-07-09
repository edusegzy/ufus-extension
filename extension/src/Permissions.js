var Exception = require('./Exception')

module.exports = Permissions


function Permissions(ctx, store) {
  this._ctx = ctx
  this.store = store
}

Permissions.prototype.request = function(permission) {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.permissions.request({
      permissions: [ permission ]
    }, function(granted) {
      if (self._ctx.chrome.runtime.lastError) {
        return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
      }

      self.store.set(permission + '_permission', granted)
      resolve(granted)
    })
  })
}

Permissions.prototype.query = function(permission) {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.permissions.contains({
      permissions: [ permission ]
    }, function(granted) {
      if (self._ctx.chrome.runtime.lastError) {
        return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
      }

      resolve(granted)
    })
  })
}

Permissions.prototype.remove = function(permission) {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.permissions.remove({
      permissions: [ permission ]
    }, function(revoked) {
      if (self._ctx.chrome.runtime.lastError) {
        return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
      }

      resolve(revoked)
    })
  })
}
