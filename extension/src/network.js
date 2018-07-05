var Exception = require('./exception')

module.exports = Network


function Network(ctx) {
  this._ctx = ctx
}

Network.prototype.init = function(payload, options) {
  return {
    headers: options.headers,
    body: payload,
    method: options.method
  }
}

Network.prototype.request = function(url, payload, options) {
  return this._ctx.fetch(url, this.init(payload, options))
}

Network.prototype.parse = function(response) {
  if (response.status >= 500) {
    return Promise.reject(new Exception('SERVER_ERR', 'server error'))
  }

  if (response.status >= 400) {
    return Promise.reject(new Exception('CLIENT_ERR', response.status + ' ' + response.statusText))
  }

  return response.json()
}
