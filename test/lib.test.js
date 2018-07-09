import test from 'ava'
import Lib from '../extension/src/Lib'

test.beforeEach(t => {
  t.context.lib = new Lib()
})

test('#datetime return visual formatted date and time', t => {
  const services = t.context
  const dt = new Date()
  const actual = services.lib.datetime(dt.toISOString())
  let expect = dt.getFullYear()
  
  t.plan(4)
  t.log(actual)
  t.true(actual.includes(expect))
  t.regex(actual, /\w+(\s\d+\,)+(\s)(\d+(\:|\2))+(AM|PM)/)

  expect = Date
  t.is(dt.constructor, expect)

  expect = dt.getDate()
  t.true(actual.includes(expect))
})

test('#truncate appends ellipsis to sliced string greater than {count}', t => {
  const services = t.context
  let actual = services.lib.truncate('https://github.com/akinjide/ufus-extension', 20)
  let expect = 'https://github.com/a...'

  t.plan(2)
  t.log(actual)
  t.is(actual, expect)

  actual = services.lib.truncate('hello world', 5)
  expect = 'hello...'
  t.log(actual)
  t.is(actual, expect)
})
