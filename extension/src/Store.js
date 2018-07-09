module.exports = Store


function Store(ctx, storePrefix, defaults) {
  this._ctx = ctx
  this._storage = this._ctx.localStorage
  this._prefix = storePrefix
  this._defaults = defaults
}

Store.prototype.get = function(key) {
  var value = this._storage.getItem(this._prefix + key)

  if (value == null) {
    return this._defaults[key]
  }

  return value == 'true' || value
}

Store.prototype.set = function(key, value) {
  this._storage.setItem(this._prefix + key, value)
}

Store.prototype.remove = function(key) {
  this._storage.removeItem(this._prefix + key)
}

Store.prototype.clear = function() {
  this._storage.clear()
}

Store.prototype.usage = function(key) {
  var self = this

  return new Promise(function(resolve, reject) {
    if (self._ctx.chrome.runtime.lastError) {
      return reject(self._ctx.chrome.runtime.lastError)
    }

    // Reference: https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
    for (_x in self._storage) {
      if (self._prefix + key == _x) {
        var KiBInUse = (((self._storage[_x].length + _x.length) * 2) / 1024)
        return resolve(KiBInUse / 1024)
      }
    }
  })
}