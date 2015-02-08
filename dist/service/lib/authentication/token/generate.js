(function() {
  var Q, jwt, uuid;

  uuid = require('node-uuid');

  Q = require('q');

  jwt = require('jsonwebtoken');

  module.exports = function(agent) {
    var obj, _base;
    if ((agent != null ? agent.uuid : void 0) == null) {
      return Q.reject('Invalid agent');
    }
    if (agent.api_key) {
      obj = {
        key: agent.uuid,
        api_key: agent.api_key
      };
      return Q.resolve(jwt.sign(obj, (_base = process.env).ELEMENT_JWT_KEY != null ? _base.ELEMENT_JWT_KEY : _base.ELEMENT_JWT_KEY = 'ELEMENT_DEV'));
    }
    agent.api_key = uuid.v4();
    return agent.savePromise().then(function() {
      return module.exports(agent);
    });
  };

}).call(this);
