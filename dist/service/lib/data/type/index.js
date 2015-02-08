(function() {
  var Type, model, schema;

  schema = require('./schema');

  model = require('../model');

  module.exports = Type = model.define('Type', schema);

}).call(this);
