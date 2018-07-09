module.exports = Clipboard


function Clipboard(ctx) {
  this._ctx = ctx
  this._element = this._ctx.document.createElement("textarea");
}

Clipboard.prototype.paste = function() {
  this._ctx.document.execCommand('paste')
}

Clipboard.prototype.cut = function() {
  this._ctx.document.execCommand('cut')
}

Clipboard.prototype.copy = function(text) {
  this._attach(text)
  this._ctx.document.execCommand('copy')
  this._reset()
}

Clipboard.prototype._attach = function(text) {
  this._element.textContent = text;
  this._ctx.document.body.appendChild(this._element);
  this._element.select();
}

Clipboard.prototype._reset = function() {
  this._element.blur()
  this._ctx.document.body.removeChild(this._element)
}