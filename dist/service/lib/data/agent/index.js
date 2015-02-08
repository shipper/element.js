(function() {
  var Agent, model, schema;

  schema = require('./schema');

  model = require('../model');

  module.exports = Agent = model.define('Agent', schema);

}).call(this);
