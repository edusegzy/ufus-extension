var services = require('./src')({
  ctx: window
})


function detectConnectionHandler(event) {
  if (event.type == 'offline') {
    return services.badge.warn('network')
  }

  services.badge.default('network')
}

function pong(request, _) {  
  console.log(request)
    
  if (request && request.mode) {
    switch (request.type) {
      case 'error':
        services.badge.error(request.message.name || 'default')
        break

      case 'info':
        if (request.message) {
          services.badge.default(
            services.badge.count(request.message)
          )
        }

        break

      case 'notify':
        Promise.all([
          services.storeSync.get('showNotifications'),
          services.storeSync.get('playNotifications')
        ])
        .then(function(response) {
          if (response && response[0].showNotifications) {
            services.notifications.show(request.message)
          }

          if (response && response[1].playNotifications) {
            services.notifications.play()
          }
        })

        break
    }
  }
}

function main() {
  if (navigator.onLine) {
    services.badge.default('network')
  } else {
    services.badge.warn('network')
  }
}

function installerHandler(details) {
  if (details.reason == 'install') {
    window.chrome.runtime.openOptionsPage()
  }
}

window.addEventListener('online', detectConnectionHandler)
window.addEventListener('offline', detectConnectionHandler)

services.permissions.query('notifications').then(function(granted) {
  if (granted) {
    window.chrome.notifications.onClicked.addListener(function(id) {
      services.clipboard.copy(
        services.store.get(id)
      )

      services.notifications.close(id).then(function() {
        services.notifications.remove(id)
      }).catch(function(error) {
        // TOOD: handle error
      })
    })

    window.chrome.notifications.onClosed.addListener(function(id) {
      services.notifications.close(id).then(function() {
        services.notifications.remove(id)
      }).catch(function(error) {
        // TOOD: handle error
      })
    })
  }
}).catch(function(error) {
  // TOOD: handle error
})

window.chrome.runtime.onInstalled.addListener(installerHandler)
window.chrome.runtime.onMessage.addListener(pong);

main()