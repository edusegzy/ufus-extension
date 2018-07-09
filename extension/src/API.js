var Exception = require('./Exception')

module.exports = API


function API(ctx, network, store) {
  this._ctx = ctx
  this._network = network
  this._store = store
}

API.prototype.buildResponse = function(data) {
  var now = new Date()

  return {
    hash: data.hash,
    short_url: data.short_url,
    long_url: data.long_url,
    requested_at: now.toISOString()
  }
}

API.prototype.buildRequest = function(data) {
  return JSON.stringify(data)
}

API.prototype.request = function(payload) {
  return this._network.request(
    this._store.get('rootURI'),
    this.buildRequest(payload),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
  ).then(this._network.parse)
   .then(this.buildResponse)
   .catch(function(error) {
     throw new Exception(error.name, error.message)
   })
}
