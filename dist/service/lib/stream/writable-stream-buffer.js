(function() {
  var StreamBuffers, Writable, WritableStreamBuffer,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Writable = require('stream').Writable;

  StreamBuffers = require('stream-buffers');

  WritableStreamBuffer = (function(_super) {
    __extends(WritableStreamBuffer, _super);

    WritableStreamBuffer.prototype.base = void 0;

    function WritableStreamBuffer() {
      this.base = new StreamBuffers.WritableStreamBuffer();
      this.on('finish', (function(_this) {
        return function() {
          return _this.base.end();
        };
      })(this));
    }

    WritableStreamBuffer.prototype._write = function(data) {
      return this.base.write(data);
    };

    WritableStreamBuffer.prototype.getContents = function(length) {
      if (length == null) {
        length = void 0;
      }
      return this.base.getContents(length);
    };

    WritableStreamBuffer.prototype.getContentsAsString = function(encoding, length) {
      if (encoding == null) {
        encoding = void 0;
      }
      if (length == null) {
        length = void 0;
      }
      return this.base.getContentsAsString(encoding, length);
    };

    return WritableStreamBuffer;

  })(Writable);

  module.exports = WritableStreamBuffer;

}).call(this);
