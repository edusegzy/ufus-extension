import test from 'ava'
import sinon from 'sinon'
import EventEmitter from 'events'
import StoreSync from '../extension/src/StoreSync'
import Option from '../extension/src/Option'
import constants from '../extension/src/constants'

test.beforeEach(t => {
  const emitter = new EventEmitter()

  emitter.addEventListener = emitter.on.bind(emitter)
  t.context.element = emitter
  window.document = {
    getElementById: sinon.stub().returns(t.context.element)
  }
  t.context.optionParams = {
    id: 'id',
    type: 'value',
    storeKey: 'key',
    onChange() {}
  }
  t.context.constants = constants
  t.context.storeSync = new StoreSync(window, constants.defaults)
  t.context.option = new Option(window, t.context.storeSync, t.context.optionParams)
})

test('#read returns value from store', async t => {
  const services = t.context
  const actual = { 'key': 20 }

  window.chrome.storage.sync.get = sinon.stub().yieldsAsync(actual)

  let expect = await services.option.read()
  t.deepEqual(expect, actual)

  expect = t.context.option.element.value
  t.is(expect, actual.key)
  t.true(window.chrome.storage.sync.get.calledWith(t.context.option.storeKey))
})

test('#write allow value store and override', t => {
  const services = t.context
  const actual = 30

  window.chrome.storage.sync.set = sinon.stub()
  t.context.option.element.value = actual
  services.option.write()

  t.true(window.chrome.storage.sync.set.calledWith({ [t.context.option.storeKey]: actual }))
  t.true(window.chrome.storage.sync.set.calledOnce)

  const expect = 40
  services.option.write(expect)

  t.is(t.context.option.element.value, expect)
})

test('#onChange', t => {
  const services = t.context
  const params = Object.assign({}, services.optionParams, {onChange: sinon.spy()})
  const option = new Option(window, services.storeSync, params)
  
  t.context.element.emit('change')

  t.true(params.onChange.calledOnce)
  t.deepEqual(params.onChange.lastCall.args[0], option)
})