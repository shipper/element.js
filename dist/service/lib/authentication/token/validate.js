(function() {
  var Agent, exports, jwt, validate;

  jwt = require('jsonwebtoken');

  Agent = require('../../data/agent');

  validate = function(token, next) {
    var getAgent, _base;
    if (!((token != null) && token.length)) {
      return next(new Error('No token'));
    }
    getAgent = function(decoded) {
      return Agent.findByUUID(decoded.key).then(function(agent) {
        if (agent.api_key !== decoded.api_key || agent.disabled === true) {
          return next(new Error('Token invalid'));
        }
        return next(null, agent);
      }).fail(function(err) {
        return next(err || new Error('Token invalid'));
      });
    };
    return jwt.verify(token, (_base = process.env).ELEMENT_JWT_KEY != null ? _base.ELEMENT_JWT_KEY : _base.ELEMENT_JWT_KEY = 'ELEMENT_DEV', function(err) {
      var decoded;
      if (err) {
        return next(err);
      }
      decoded = jwt.decode(token);
      if (!((decoded != null) && decoded instanceof Object && (decoded['api_key'] != null) && decoded['key'])) {
        return next(new Error('Token invalid'));
      }
      return getAgent(decoded);
    });
  };

  module.exports = exports = validate;

}).call(this);
