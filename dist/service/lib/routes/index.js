(function() {
  var $static, agent, element, type;

  element = require('./element');

  agent = require('./agent');

  type = require('./type');

  $static = require('./static');

  exports.register = function(server) {
    element.register(server);
    agent.register(server);
    type.register(server);
    return $static.register(server);
  };

}).call(this);
