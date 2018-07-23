import test from 'ava'
import sinon from 'sinon'
import Badge from '../extension/src/Badge'
import constants from '../extension/src/constants'

test.beforeEach(t => {
  window.chrome.browserAction.setBadgeText = sinon.spy()
  window.chrome.browserAction.setBadgeBackgroundColor = sinon.spy()
  window.chrome.browserAction.setTitle = sinon.spy()
  
  t.context.constants = constants
  t.context.badge = new Badge(window, constants)
})

test('#default render recents count with default badge color', t => {
  const services = t.context
  const text = services.badge.count(20)
  const title = services.constants.defaultTitle
  const color = services.constants.DEFAULT.color
  
  services.badge.default(text)

  t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))
  t.true(window.chrome.browserAction.setTitle.calledWith({ title }))
  t.true(window.chrome.browserAction.setBadgeBackgroundColor.calledWith({ color }))
})

test('#default render infinity icon when recents count > 9999', t => {
  const services = t.context
  const text = services.badge.count(10000)
  const title = services.constants.defaultTitle
  const color = services.constants.DEFAULT.color
  
  services.badge.default(text)

  t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))
  t.true(window.chrome.browserAction.setTitle.calledWith({ title }))
  t.true(window.chrome.browserAction.setBadgeBackgroundColor.calledWith({ color }))
  t.is(color.length, 4)
  
  for (const x of color) {
    t.is(typeof x, 'number')
    t.true(x >= 0 && x <= 255)
  }
})

test('#default use proper symbols for default', t => {
  const services = t.context
  let text = 'ON'
  let title = 'network'

  services.badge.default(title)

  t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))
})

test('#error render {?} and message with error badge color', t => {
  const services = t.context
  const text = '?'
  const title = 'Unknown error'
  const color = services.constants.ERROR.color
  
  services.badge.error()

  t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))
  t.true(window.chrome.browserAction.setTitle.calledWith({ title }))
  t.true(window.chrome.browserAction.setBadgeBackgroundColor.calledWith({ color }))
  t.is(color.length, 4)
  
  for (const x of color) {
    t.is(typeof x, 'number')
    t.true(x >= 0 && x <= 255)
  }
})

test('#error use proper messages for errors', t => {
  const services = t.context
  const titles = [
    'default',
    'SERVER_ERR',
    'CLIENT_ERR',
    'QUOTA_EXCEEDED_ERR'
  ]
  
  for (const title of titles) {
    services.badge.error(title)
    const actual = window.chrome.browserAction.setTitle.lastCall.args[0].title
    const expect = services.constants.ERROR.titles[title]

    t.is(actual, expect)
  }
})

test('#error use proper symbols for errors', t => {
  const services = t.context
  const defaultSymbolTitles = [
    'default',
    'SERVER_ERR',
    'QUOTA_EXCEEDED_ERR'
  ]
  
  const crossMarkSymbolTitles = [
    'CLIENT_ERR'
  ]
  
  for (const title of defaultSymbolTitles) {
    const text = '?'
    services.badge.error(title)

    t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))
  }
  
  for (const title of crossMarkSymbolTitles) {
    const text = 'X'
    services.badge.error(title)

    t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))
  }
})

test('#warn render {!} and message with warn badge color', t => {
  const services = t.context
  const text = '!'
  const title = 'Unknown warning'
  const color = services.constants.WARN.color
  
  services.badge.warn()

  t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))
  t.true(window.chrome.browserAction.setTitle.calledWith({ title }))
  t.true(window.chrome.browserAction.setBadgeBackgroundColor.calledWith({ color }))
  t.is(color.length, 4)
  
  for (const x of color) {
    t.is(typeof x, 'number')
    t.true(x >= 0 && x <= 255)
  }
})

test('#warn use proper messages for warn', t => {
  const services = t.context
  const titles = [
    'default',
    'network'
  ]
  
  for (const title of titles) {
    services.badge.warn(title)
    const actual = window.chrome.browserAction.setTitle.lastCall.args[0].title
    const expect = services.constants.WARN.titles[title]

    t.is(actual, expect)
  }
})

test('#warn use proper symbols for warn', t => {
  const services = t.context
  let text = '!'
  let title = 'default'

  services.badge.warn(title)

  t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))

  text = 'OFF'
  title = 'network'

  services.badge.warn(title)

  t.true(window.chrome.browserAction.setBadgeText.calledWith({ text }))
})