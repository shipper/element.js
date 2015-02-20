(function() {
  var Agent, Q, exports, jwt, uuid, _;

  uuid = require('node-uuid');

  Q = require('q');

  jwt = require('jsonwebtoken');

  _ = require('lodash');

  Agent = require('../../data/agent');

  module.exports = exports = function(agent, type, set) {
    var deferred, obj, update, _base, _base1, _ref, _ref1, _ref2;
    if (type == null) {
      type = exports.AUTHENTICATION;
    }
    if (set == null) {
      set = 'default';
    }
    if ((agent != null ? agent.uuid : void 0) == null) {
      return Q.reject('Invalid agent');
    }
    if (!((type != null) && _.values(exports).indexOf(type) !== -1)) {
      return Q.reject('Invalid type');
    }
    if (agent.api == null) {
      agent.api = {};
    }
    if ((_base = agent.api).keys == null) {
      _base.keys = {};
    }
    if ((((_ref = agent.api.keys[set]) != null ? _ref[type] : void 0) != null) && (agent.api.sign_key != null)) {
      obj = {
        key: agent.uuid,
        type: type,
        set: set
      };
      obj.influence = agent.api.keys[set][type];
      return Q.resolve(jwt.sign(obj, agent.api.sign_key));
    }
    update = {
      $set: {}
    };
    if (((_ref1 = agent.api.keys[set]) != null ? (_ref2 = _ref1[type]) != null ? _ref2.key : void 0 : void 0) == null) {
      if ((_base1 = agent.api.keys)[set] == null) {
        _base1[set] = {};
      }
      agent.api.keys[set][type] = uuid.v4();
      update.$set["api.keys." + set + "." + type] = agent.api.keys[set][type];
    }
    if (agent.api.sign_key == null) {
      agent.api.sign_key = uuid.v4();
      update.$set['api.sign_key'] = agent.api.sign_key;
    }
    deferred = Q.defer();
    agent.update(update, function(err) {
      if (err) {
        return next(err);
      }
      return deferred.resolve(module.exports(agent, type, set));
    });
    return deferred.promise;
  };

  exports.AUTHENTICATION = 'authentication';

  exports.DEVELOPMENT = "development";

  exports.PRODUCTION = "production";

}).call(this);
