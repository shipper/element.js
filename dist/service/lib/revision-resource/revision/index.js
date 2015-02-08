(function() {
  var mongoose, schema;

  mongoose = require('mongoose');

  schema = require('./schema');

  exports.define = function(name) {
    return mongoose.model(name + ".revision", schema);
  };

}).call(this);
