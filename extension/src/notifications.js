module.exports = Notifications

function Notifications(ctx, store) {
  this._ctx = ctx
  this.store = store
  this.audio = new this._ctx.Audio()
}

Notifications.prototype.remove = function(id) {
  this.store.remove(id)
}

Notifications.prototype.play = function() {
  this.audio.src = this._ctx.chrome.extension.getURL('/sounds/chime.ogg');
  this.audio.play();
}

Notifications.prototype.close = function(id) {
  var self = this

  return new Promise(function(resolve, reject) {
    self._ctx.chrome.notifications.clear(id, resolve)
  })
}

Notifications.prototype.buildNotificationObject = function(notification) {
  return {
    title: 'Ufus',
    iconUrl: 'images/icon128.png',
    type: 'basic',
    message: notification.short_url,
    contextMessage: 'Click to copy shortened link below.'
  }
}

Notifications.prototype.generateNotificationId = function(notification) {
  return notification.hash + ':' + Math.random().toString().slice(2)
}

Notifications.prototype.show = function(notification) {
  var notificationId =  this.generateNotificationId(notification)

  this._ctx.chrome.notifications.create(
      notificationId,
      this.buildNotificationObject(notification)
  )

  this.store.set(notificationId, notification.short_url)
}