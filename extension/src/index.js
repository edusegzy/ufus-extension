/**
 * Module dependencies
 */

var Store = require('./store')
var StoreSync = require('./store-sync')
var Badge = require('./badge')
var constants = require('./constants')
var Permissions = require('./permissions')
var Network = require('./network')
var Tabs = require('./tabs')
var Option = require('./option')
var Popup = require('./popup')
var API = require('./api')
var Exception = require('./exception')
var Notifications = require('./notifications')
var Clipboard = require('./clipboard')
var Lib = require('./lib')


/**
 * Expose Services
 * @constructor
 */

module.exports = function Services(options) {
  if (!(this instanceof Services)) return new Services(options)

  this.constants = constants
  this.Option = Option
  this.Popup = Popup
  this.Exception = Exception
  this.store = new Store(options.ctx, this.constants.defaults.storePrefix, this.constants.defaults)
  this.storeSync = new StoreSync(options.ctx, this.constants.defaults)
  this.badge = new Badge(options.ctx, this.constants)
  this.permissions = new Permissions(options.ctx, this.store)
  this.network = new Network(options.ctx)
  this.tabs = new Tabs(options.ctx, this.store, this.permissions)
  this.api = new API(options.ctx, this.network, this.store)
  this.notifications = new Notifications(options.ctx, this.store)
  this.clipboard = new Clipboard(options.ctx)
  this.lib = new Lib()
}