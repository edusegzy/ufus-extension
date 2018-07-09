var Exception = require('./Exception')

module.exports = Popup


function Popup(ctx, store, storeSync, options) {
  this._ctx = ctx
  this.id = options.id
  this.type = options.type
  this.eventKey = options.eventKey
  this.services = options.services
  this.event = options.event
  this.element = this._ctx.document.getElementById(this.id)

  if (this.element) {
    this.element.addEventListener(this.event, function(e) {
      options[this.eventKey](this, e)
    }.bind(this))
  }

  this.store = store
  this.storeSync = storeSync
}

Popup.prototype.read = function(key) {
  if (this.store.get(key)) {
    return this.parse(
      this.b64Decode(
        this.store.get(key)
      )
    )
  }

  return []
}

Popup.prototype.write = function(data, key) {
  var self = this

  return new Promise(function(resolve, reject) {
    self.storeSync.get('storageSize').then(function(response) {
      var storeData = self.read(key)
      var quotaInBytes = 3 * 1024 * 1024
      var payload = null

      if (storeData) {
        if (storeData.length >= parseInt(response.storageSize)) {
          // TODO: remove after debugging
          self.store.set('debug:quota_exceeded', response.storageSize)
          return reject(new Exception('QUOTA_EXCEEDED_ERR', 'max quota storagesize exceeded'))
        }

        if (storeData[0]) {
          payload = [data].concat(storeData)
        } else {
          payload = [data]
        }
      }

      resolve(
        self.store.set(key, (function() {
          return self.b64Encode(
            self.stringify(payload)
          )
        }())
      ))
    })
  })
}

Popup.prototype.parse = function(jsonstring) {
  try {
    return JSON.parse(jsonstring)
  } catch (error) {
    throw new Exception(error.name, error.message)
  }
}

Popup.prototype.stringify = function(data) {
  return JSON.stringify(data, null, 2)
}

Popup.prototype.b64Decode = function(base64) {
  return decodeURIComponent(escape(this._ctx.atob(base64)))
}

Popup.prototype.b64Encode = function(ucs2) {
  return this._ctx.btoa(unescape(encodeURIComponent(ucs2)))
}
