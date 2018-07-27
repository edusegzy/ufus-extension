import test from 'ava'
import sinon from 'sinon'
import constants from '../extension/src/constants'
import Store from '../extension/src/Store'
import Permissions from '../extension/src/Permissions'
import Tabs from '../extension/src/Tabs'

test.beforeEach(t => {
  t.context.constants = constants
  t.context.store = new Store(window, constants.defaults.storePrefix, constants)
  t.context.permissions = new Permissions(window, t.context.store)
  t.context.tabs = new Tabs(window, t.context.store, t.context.permissions)
})

test('#create resolves chrome.tabs.create', async t => {
  const services = t.context
  const actual = { id: 1, url: 'https://www.abc.com' }

  window.chrome.tabs.create = sinon.stub().yieldsAsync(actual)
  const expect = await services.tabs.create(actual.url)

  t.deepEqual(expect, actual)
})

test('#update resolves chrome.tabs.update', async t => {
  const services = t.context
  const actual = { id: 1, url: 'https://www.abc.com' }

  window.chrome.tabs.update = sinon.stub().yieldsAsync(actual)
  const expect = await services.tabs.update(42, { url: actual.url })

  t.deepEqual(expect, actual)
  t.true(window.chrome.tabs.update.called)
  t.true(window.chrome.tabs.query.calledOnce)
  t.is(window.chrome.tabs.update.args[0][1].url, expect.url)
})

test('#query resolves matched query tab', async t => {
  const services = t.context
  const actual = [
    { id: 1, url: 'https://www.abc.com' },
    { id: 2, url: 'https://www.xyz.com' }
  ]

  window.chrome.tabs.query = sinon.stub().yieldsAsync(actual)
  const expect = await services.tabs.query(actual[0].url)

  t.deepEqual(expect, actual)
  t.true(window.chrome.tabs.query.called)
  t.true(window.chrome.tabs.query.calledOnce)
})

test('#open new tab', async t => {
  const services = t.context
  const actual = 'https://www.abc.com'

  window.chrome.permissions.contains = sinon.stub().yieldsAsync(false)
  services.tabs.create = sinon.spy()

  await services.tabs.open(actual)

  t.true(services.tabs.create.called)
  t.true(services.tabs.create.calledOnce)
  t.is(services.tabs.create.lastCall.args[0], actual)
})

test('#open update empty tab', async t => {
  const services = t.context
  const actual = 'https://www.abc.com'
  const empty = { id: 0, url: 'chrome://newtab/' }

  window.chrome.permissions.contains = sinon.stub().yieldsAsync(true)
  services.tabs.query = sinon.stub().resolves([])

  await services.tabs.open(actual, empty)

  t.deepEqual(
    window.chrome.tabs.update.lastCall.args[1],
    { active: false, pinned: false, url: actual }
  )
})