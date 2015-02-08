(function() {
  var $static, agent, client, element, metadata, type;

  element = require('./element');

  agent = require('./agent');

  type = require('./type');

  $static = require('./static');

  metadata = require('./metadata');

  client = require('./client');

  exports.register = function(server) {
    element.register(server);
    agent.register(server);
    type.register(server);
    $static.register(server);
    metadata.register(server);
    return client.register(server);
  };

}).call(this);
