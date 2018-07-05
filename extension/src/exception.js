module.exports = Exception


function Exception(name, message) {
  this.name = name
  this.message = message || 'Unknown error.'

  Error.call(this, this.message)
}

Exception.prototype = Object.create(Error.prototype)
Exception.prototype.constructor = Exception