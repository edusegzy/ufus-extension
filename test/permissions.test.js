import test from 'ava'
import sinon from 'sinon'
import pImmediate from 'p-immediate'
import constants from '../extension/src/constants'
import Store from '../extension/src/Store'
import Exception from '../extension/src/Exception'
import Permissions from '../extension/src/Permissions'

test.beforeEach(t => {
  t.context.constants = constants
  t.context.store = new Store(window, constants.defaults.storePrefix, constants)
  t.context.permissions = new Permissions(window, t.context.store)

  window.chrome.runtime.lastError = null
})

test('#request resolves approved permission', async t => {
  const services = t.context

  window.chrome.permissions.request = sinon.stub().yieldsAsync(true)
  const expect = await services.permissions.request('tabs')

  t.true(expect)
})

test('#request rejects request permission if runtime lastError is not null', async t => {
  const services = t.context

  await pImmediate()

  window.chrome.permissions.request = sinon.stub().yieldsAsync()
  window.chrome.runtime.lastError = new Exception('LRUNTIME_ERR', 'permission request denied')

  await t.throws(services.permissions.request('tabs'))
})

test('#query resolves existing denied permission', async t => {
  const services = t.context

  window.chrome.permissions.contains = sinon.stub().yieldsAsync(false)
  const expect = await services.permissions.query('tabs')

  t.false(expect)
})

test('#query rejects query permission if runtime lastError is not null', async t => {
  const services = t.context

  await pImmediate()

  window.chrome.permissions.contains = sinon.stub().yieldsAsync()
  window.chrome.runtime.lastError = new Exception('LRUNTIME_ERR', 'permission query denied')

  await t.throws(services.permissions.query('tabs'))
})

test('#remove resolves deleted permission', async t => {
  const services = t.context

  window.chrome.permissions.remove = sinon.stub().yieldsAsync(true)
  const expect = await services.permissions.remove('tabs')

  t.true(expect)
})