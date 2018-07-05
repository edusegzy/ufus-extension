var services = require('./src')({
  ctx: window
})

document.addEventListener('DOMContentLoaded', function() {
  var activityIndicator = document.getElementById('activity-indicator')

  var Link = new services.Popup(window, services.store, services.storeSync, {
    id: 'link',
    type: 'value',
    eventKey: 'onPaste',
    event: 'paste',
    onPaste: function(popup, e) {
      activityIndicator.style.display = 'block'

      popupActionHandler(popup, e)
        .then(function(response) {
          ping('notify', response)
          return popup.write(response, 'recents')
        })
        .then(function() {
          refreshFrame(popup, activityIndicator)
        })
        .catch(function(error) {
          ping('error', error)
          popup.element.value = ''
          activityIndicator.style.display = 'none'
        })

    }
  })

  new services.Popup(window, services.store, services.storeSync, {
    id: 'link-form',
    eventKey: 'onSubmit',
    event: 'submit',
    onSubmit: function(popup, e) {
      e.preventDefault()
      activityIndicator.style.display = 'block'

      popupActionHandler(Link, e)
        .then(function(response) {
          ping('notify', response)
          return popup.write(response, 'recents')
        })
        .then(function() {
          refreshFrame(Link, activityIndicator)
        })
        .catch(function(error) {
          ping('error', error)
          Link.element.value = ''
          activityIndicator.style.display = 'none'
        })
    }
  })

  new services.Popup(window, services.store, services.storeSync, {
    id: 'clear',
    eventKey: 'onClick',
    event: 'click',
    onClick: function(popup, e) {
      popup.store.remove('recents')
      refreshFrame(popup, activityIndicator)
    }
  })

  main(Link, activityIndicator)
})

function popupActionHandler(popup, event) {
  var longURL = popup.element.value || event.clipboardData.getData('text')

  return services.tabs.query({ active: true }).then(function(tab) {
    if (!(longURL)) {
      if (tab && tab[0]) {
        longURL = popup.element.value = tab[0].url
        popup.element.select()
      }
    }

    return services.api.request({ long_url: longURL })
  })
}

function refreshFrame(popup, activityIndicator) {
  var recents = popup.read('recents')

  if (recents && recents[0]) {
    popup.storeSync.get('nerdsStack').then(function(response) {

      if (response.nerdsStack) {
        document.getElementById('normal-stack').style.display = 'none'
        document.getElementById('nerd-stack').innerHTML = JSON.stringify(recents, null, 2)
        document.getElementById('recents').style.display = 'block'
      } else {
        document.getElementById('nerd-stack').style.display = 'none'
        document.getElementById('normal-stack').innerHTML = null

        recents.forEach(function(obj, index) {
          document.getElementById('normal-stack').insertAdjacentHTML(
            'beforeend',
            '<div class="normal-stack-container">' +
              '<span id="requested-at">' + services.lib.datetime(obj.requested_at) + '</span>' +
              '<p id="long-url">' + services.lib.truncate(obj.long_url, 50) + '</p>' +
              '<p id="short-url">' + obj.short_url + '</p>' +
            '</div>'
          )

          if (recents.length == (index + 1)) {
            document.getElementById('recents').style.display = 'block'
          }
        })
      }

    })

    ping('info', recents.length)
  } else {
    document.getElementById('recents').style.display = 'none'
  }

  popup.element.value = ''
  activityIndicator.style.display = 'none'
}

function ping(type, message) {
  window.chrome.runtime.sendMessage({
    mode: 'ping',
    type: type,
    message: message
  })
}

function main(popup, activityIndicator) {
  refreshFrame(popup, activityIndicator)

  if (services.store.get('tabs_permission') == void(0)) {
    services.permissions.request('tabs').then(function(granted) {
      ping('info', granted)
    })
    .catch(function(error) {
      ping('error', error)
    })
  }
}