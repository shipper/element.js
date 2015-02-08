(function() {
  var exports, mongoose;

  mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/element');

  module.exports = exports = mongoose;

}).call(this);
