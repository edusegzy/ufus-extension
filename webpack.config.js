var path = require('path')

module.exports = {
  entry: {
    main: './extension/main.js',
    options: './extension/options.js',
    popup: './extension/popup.js'
  },
  output: {
    path: path.join(__dirname, 'extension/build'),
    filename: '[name].js'
  }  
}
