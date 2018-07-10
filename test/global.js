var chromeStub = require('chrome-stub')

global.window = {
  localStorage: {
    setItem: () => {},
    getItem: () => {},
    removeItem: () => {}
  },
  chrome: Object.assign({
    runtime: {},
	notifications: {}
  },
  chromeStub)
}