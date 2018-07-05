module.exports = Lib


function Lib() {}

Lib.prototype.truncate = function(text, count) {
  if (text.length > count) {
    return text.substring(0, count) + '...'
  }

  return text
}

Lib.prototype.datetime = function(dt) {
  var d = new Date(dt)

  return d.toLocaleString("en-us", {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  })
}