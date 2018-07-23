import test from 'ava'
import sinon from 'sinon'
import StoreSync from '../extension/src/StoreSync'
import constants from '../extension/src/constants'

test.beforeEach(t => {
  t.context.constants = constants
  t.context.storeSync = new StoreSync(window, constants.defaults)
})

test('#set call chromeStorageArea#set to persist value', async t => {
  const services = t.context

  await services.storeSync.set({ 'appName': 'Ufus' })
  t.true(window.chrome.storage.sync.set.called)
  t.true(window.chrome.storage.sync.set.calledWith({ 'appName': 'Ufus'}))
})

test('#get call chromeStorageArea#get returns value', async t => {
  const services = t.context
  const actual = await services.storeSync.get('appName')
  const expect = { appName: 'Ufus' }

  t.true(window.chrome.storage.sync.get.calledWith('appName'))
  t.deepEqual(actual, expect)
})

test('#remove call chromeStorageArea#remove to delete value', async t => {
  const services = t.context

  await services.storeSync.remove('appName')
  t.true(window.chrome.storage.sync.remove.calledWith('appName'))
})

test('#clear call chromeStorageArea#clear to empty store', async t => {
  const services = t.context

  await services.storeSync.clear()
  t.true(window.chrome.storage.sync.clear.called)
})
