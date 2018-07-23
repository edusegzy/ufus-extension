import test from 'ava'
import sinon from 'sinon'
import Store from '../extension/src/Store'
import constants from '../extension/src/constants'

test.beforeEach(t => {
  t.context.constants = constants
  t.context.store = new Store(window, constants.defaults.storePrefix, constants)
})

test('#get call localStorage#getItem', t => {
  const services = t.context
  
  window.localStorage.getItem = sinon.spy()
  const actual = services.store.get('name')
  
  t.falsy(actual)
  t.true(window.localStorage.getItem.calledWith('ufus:name'))
})

test('#get return localStorage#getItem with boolean value', t => {
  const services = t.context
  
  window.localStorage.getItem = sinon.stub().returns(false)
  const actual = services.store.get('readActiveTab')
  
  t.false(actual)
  t.true(window.localStorage.getItem.calledWith('ufus:readActiveTab'))
})

test('#get return localStorage#getItem undefined, if no item found', t => {
  const services = t.context
  
  window.localStorage.getItem = sinon.stub().returns(null)
  const actual = services.store.get('rootURI')
  const expect = void(0)

  t.is(actual, expect)
})

test('#set call localStorage#setItem to persist value', t => {
  const services = t.context
  const db = {value: 42}
  
  window.localStorage.setItem = sinon.stub()
  services.store.set('name', db)

  t.true(window.localStorage.setItem.calledWith('ufus:name', db))
})

test('#clear call localStorage#clear to empty storage', t => {
  const services = t.context
  
  window.localStorage.clear = sinon.spy()
  services.store.clear()

  t.true(window.localStorage.clear.called)
})

test('#remove call localStorage#removeItem to delete value', t => {
  const services = t.context
  
  window.localStorage.removeItem = sinon.spy()
  services.store.remove()

  t.true(window.localStorage.clear.called)
})