var Exception = require('./Exception')

module.exports = Option

function Option(ctx, storeSync, options) {
  this._ctx = ctx
  this.id = options.id
  this.type = options.type
  this.storeKey = options.storeKey
  this.element = this._ctx.document.getElementById(this.id)
  this.element.addEventListener('change', function() {
    options.onChange(this)
  }.bind(this))
  this.storeSync = storeSync
  this.read()
}

Option.prototype.read = function() {
  var self = this

  return new Promise(function(resolve, reject) {
    self.storeSync.get(self.storeKey).then(function(response) {
      self.element[self.type] = response[self.storeKey]

      resolve(response)
    }).catch(function(error) {
      if (error != null) {
        reject(new Exception(error.name, error.message))
      }
    })
  })
}

Option.prototype.write = function(override) {
  var self = this

  if (override) {
    this.element[this.type] = override
  }

  return new Promise(function(resolve, reject) {
    self.storeSync.set({ [self.storeKey]: self.element[self.type] }).then(function(response) {
      resolve(response)
    }).catch(function(error) {
      if (error != null) {
        reject(new Exception(error.name, error.message))
      }
    })
  })
}
