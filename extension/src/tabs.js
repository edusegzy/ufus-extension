var Exception = require('./exception')

module.exports = Tab


function Tab(ctx, store, permissions) {
  this._ctx = ctx
  this.store = store
  this.permissions = permissions
  this.defaults = {
    active: false,
    pinned: false
  }
}

Tab.prototype.create = function(url, options) {
  var self = this
  var options = options || {}

  return new Promise(function(resolve, reject) {
    if (self._ctx.chrome.runtime.lastError) {
      return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
    }

    self._ctx.chrome.tabs.create(Object.assign({ 
      url: url
    }, self.defaults, options), resolve)
  })
}

Tab.prototype.update = function(id, options) {
  var self = this
  var options = options || {}

  return new Promise(function(resolve, reject) {
    if (self._ctx.chrome.runtime.lastError) {
      return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
    }

    self._ctx.chrome.tabs.update(id, Object.assign(self.defaults, options), resolve)
  })
}

Tab.prototype.query = function(options) {
  var self = this
  var options = options || {}

  return new Promise(function(resolve, reject) {
    if (self._ctx.chrome.runtime.lastError) {
      return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
    }

    self._ctx.chrome.tabs.query(Object.assign({ 
      currentWindow: true 
    }, self.defaults, options), resolve)
  })
}

Tab.prototype.open = function(url, tab) {
  var self = this

  return self.permissions.query('tabs').then(function(granted) {
    if (granted) {
      return self.query({ url: url })
    }
  }).then(function(tabs) {
    if (tabs) {
      if (tabs.length) {
        return self.update(tabs[0].id, { url: url, active: true })
      }

      if (tab.url == 'chrome://newtab/') {
        return self.update(null, { url: url })
      }
    }

    return self.create(url)
  })
}

Tab.prototype.close = function(id) {
  var self = this
  
  return new Promise(function(resolve, reject) {
    if (self._ctx.chrome.runtime.lastError) {
      return reject(new Exception('LRUNTIME_ERR', self._ctx.chrome.runtime.lastError))
    }

    self._ctx.chrome.tabs.remove(id, resolve)
  })
}
