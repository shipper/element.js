(function() {
  var Agent, exports, jwt, validate;

  jwt = require('jsonwebtoken');

  Agent = require('../../data/agent');

  validate = function(token, next) {
    var decoded;
    if (!((token != null) && token.length)) {
      return next(new Error('No token'));
    }
    decoded = jwt.decode(token);
    if (!((decoded != null) && decoded instanceof Object && (decoded['type'] != null) && (decoded['set'] != null) && (decoded['influence'] != null) && decoded['key'])) {
      return next(new Error('Token invalid'));
    }
    return Agent.findByUUID(decoded.key).then(function(agent) {
      var _ref, _ref1, _ref2;
      if (!((_ref = agent.api) != null ? (_ref1 = _ref.keys) != null ? _ref1[decoded['set']][decoded['type']] : void 0 : void 0) || !((_ref2 = agent.api.sign_key) != null ? _ref2.trim().length : void 0) || agent.api.keys[decoded.set][decoded.type] !== decoded['influence'] || agent.disabled === true) {
        return next(new Error('Token invalid'));
      }
      return jwt.verify(token, agent.api.sign_key, function(err) {
        var type;
        if (err) {
          return next(err);
        }
        type = decoded.type;
        if (type === 'authentication') {
          type = 'development';
        }
        agent.environment = type;
        return next(null, agent);
      });
    });
  };

  module.exports = exports = validate;

}).call(this);
