var services = require('./src')({
  ctx: window
})

document.addEventListener('DOMContentLoaded', function() {
  var activityIndicator = document.getElementById('activity-indicator')

  var Link = new services.Popup(window, services.store, services.storeSync, {
    id: 'link',
    type: 'value',
    eventKey: 'onPaste',
    services: {
      activityIndicator: activityIndicator,
      dom: {
        stack: {
          nerd: document.getElementById('nerd-stack'),
          normal: document.getElementById('normal-stack')
        },
        recents: document.getElementById('recents')
      }
    },
    event: 'paste',
    onPaste: function(popup, e) {
      popup.services.activityIndicator.style.display = 'block'

      popupActionHandler(popup, e)
        .then(function(response) {
          refreshFrame(popup)
        })
    }
  })

  new services.Popup(window, services.store, services.storeSync, {
    id: 'link-form',
    eventKey: 'onSubmit',
    event: 'submit',
    services: {
      activityIndicator: activityIndicator
    },
    onSubmit: function(popup, e) {
      e.preventDefault()
      popup.services.activityIndicator.style.display = 'block'

      popupActionHandler(Link, e)
        .then(function(response) {
          refreshFrame(Link)
        })
    }
  })

  new services.Popup(window, services.store, services.storeSync, {
    id: 'clear',
    eventKey: 'onClick',
    event: 'click',
    onClick: function(popup, e) {
      popup.store.remove('recents')
      refreshFrame(popup)
    }
  })

  main(Link)
})

function popupActionHandler(popup, event) {
  return popup.storeSync.get('readActiveTab')
    .then(function(response) {
      if (response.readActiveTab) {
        // popup.services.activityIndicator.style.display = 'block'
        return services.tabs.query({ active: true })
      }

      return Promise.resolve([])
    })
    .then(function(tab) {
      var longURL;

      if (tab && tab[0]) {
        longURL = popup.element.value = tab[0].url
        popup.element.select()
      } else {
        longURL = popup.element.value || (event && event.clipboardData.getData('text'))
      }

      return new Promise(function (resolve) {
        if (longURL) {
          ping('process', {
            long_url: longURL
          }, resolve)
        }
      })
    })
}

function refreshFrame(popup) {
  var recents = popup.read('recents')

  if (recents && recents[0]) {
    popup.storeSync.get('nerdsStack').then(function(response) {

      if (response.nerdsStack) {
        popup.services.dom.stack.normal.style.display = 'none'
        popup.services.dom.stack.nerd.innerHTML = JSON.stringify(recents, null, 2)
        popup.services.dom.recents.style.display = 'block'
      } else {
        popup.services.dom.stack.nerd.style.display = 'none'
        popup.services.dom.stack.normal.innerHTML = null

        recents.forEach(function(obj, index) {
          popup.services.dom.stack.normal.insertAdjacentHTML(
            'beforeend',
            '<div class="normal-stack-container" title="Click to copy shortened link">' +
              '<span id="requested-at">' + services.lib.datetime(obj.requested_at) + '</span>' +
              '<p id="long-url">' + services.lib.truncate(obj.long_url, 50) + '</p>' +
              '<p id="short-url">' + obj.short_url + '</p>' +
            '</div>'
          )

          if (recents.length == (index + 1)) {
            popup.services.dom.recents.style.display = 'block'
            registerStackHandler()
          }
        })
      }

    })

    ping('info', recents.length)
  } else {
    popup.services.dom.recents.style.display = 'none'
  }

  popup.element.value = ''
  popup.services.activityIndicator.style.display = 'none'
}

function registerStackHandler() {
  var popupAlert = document.getElementById('popup-alert');

  [].slice.call(document.getElementsByClassName('normal-stack-container')).forEach(
    function(stack, index) {
      stack.style.cursor = 'pointer'
      stack.addEventListener('click', function(e) {
        popupAlert.style.display = 'block'
        popupAlert.innerHTML = '* <strong>' + stack.lastChild.textContent + '</strong> Copied!'
        ping('copy', stack.lastChild.textContent)
      })
    }
  )
}

function ping(type, message, callback) {
  window.chrome.runtime.sendMessage({
    mode: 'ping',
    type: type,
    message: message
  }, function(response) {
    if (response) {
      callback(response)
    }
  })
}

function main(popup) {
  refreshFrame(popup)

  if (services.store.get('tabs_permission') == void(0)) {
    services.permissions.request('tabs').then(function(granted) {
      if (granted) {
        popupActionHandler(popup)
          .then(function(response) {
            refreshFrame(popup)
          })
      }

      ping('info', granted)
    })
    .catch(function(error) {
      ping('error', error)
    })
  } else {
    popupActionHandler(popup)
      .then(function(response) {
        refreshFrame(popup)
      })
  }
}
