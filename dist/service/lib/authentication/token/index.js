(function() {
  exports.generate = require('./generate');

  exports.validate = require('./validate');

  exports.kill = require('./kill');

  exports.AUTHENTICATION = exports.generate.AUTHENTICATION;

  exports.DEVELOPMENT = exports.generate.DEVELOPMENT;

  exports.PRODUCTION = exports.generate.PRODUCTION;

}).call(this);
