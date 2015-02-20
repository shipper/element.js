(function() {
  var Agent, Q, Token, authentication, _;

  authentication = require('../../authentication');

  Agent = require('../../data/agent');

  _ = require('lodash');

  Q = require('q');

  Token = authentication.Token;

  exports.register = function(server) {
    server.get('/api/agent/self', authentication, exports.get);
    server.get('/api/agent/self/key', authentication, exports.keys);
    server.get('/api/agent/self/key/set/:set/type/:type', authentication, exports.generate);
    server.get('/api/agent/self/key/set/:set', authentication, exports.generate);
    server.get('/api/agent/self/key/:type', authentication, exports.generate);
    server.del('/api/agent/self/key/set/:set/type/:type', authentication, exports.kill);
    server.del('/api/agent/self/key/set/:set', authentication, exports.kill);
    server.del('/api/agent/self/key/:type', authentication, exports.kill);
    server.get('/api/agent/self/key/set/:set/type/:type/new', authentication, exports.reGenerate);
    server.get('/api/agent/self/key/set/:set/new', authentication, exports.reGenerate);
    server.get('/api/agent/self/key/:type/new', authentication, exports.reGenerate);
    return server.post('/api/agent/login', exports.login);
  };

  exports.login = function(req, res, next) {
    return Agent.findByUsername(req.body.username).then(function(agent) {
      return agent.verifyPassword(req.body.password);
    }).then(function(agent) {
      return Token.generate(agent, Token.AUTHENTICATION);
    }).then(function(token) {
      return res.send(200, token);
    }).fail(function(error) {
      return next(error);
    });
  };

  exports.getKeys = function(agent) {
    var api, keys, promises, result;
    result = {};
    api = agent.api;
    if ((api != null ? api.keys : void 0) == null) {
      return Q.resolve(result);
    }
    keys = _.keys(api.keys);
    if (!keys.length) {
      return Q.resolve(result);
    }
    promises = _.map(keys, function(key) {
      return exports.getKeysForSet(agent, key).then(function(keys) {
        return result[key] = keys;
      });
    });
    return Q.all(promises).then(function() {
      return result;
    });
  };

  exports.getKeysForSet = function(agent, set_name) {
    var api, keys, obj, promises, set, set_keys;
    obj = {
      production: null,
      production_set: false,
      development: null,
      development_set: false
    };
    api = agent.api;
    if ((api != null ? api.keys : void 0) == null) {
      return Q.resolve(obj);
    }
    set = api.keys[set_name];
    if (set == null) {
      return Q.resolve(obj);
    }
    keys = [Token.PRODUCTION, Token.DEVELOPMENT];
    set_keys = _.keys(set);
    keys = _.filter(keys, function(key) {
      return set_keys.indexOf(key) !== -1;
    });
    if (!keys.length) {
      return Q.resolve(obj);
    }
    promises = _.map(keys, function(key) {
      return authentication.Token.generate(agent, key, set_name).then(function(token) {
        return obj[key] = token;
      });
    });
    return Q.all(promises).then(function() {
      _.each(keys, function(key) {
        return obj[key + "_set"] = !!obj[key];
      });
      return obj;
    });
  };

  exports.keys = function(req, res) {
    return exports.getKeys(req.user).then(function(keys) {
      return res.send(200, keys);
    }).fail(function(error) {
      return res.send(500, error);
    });
  };

  exports.get = function(req, res) {
    return res.send(200, req.user);
  };

  exports.generate = function(req, res) {
    return authentication.Token.generate(req.user, req.params.type, req.params.set).then(function(key) {
      return res.send(200, key);
    }).fail(function(err) {
      return res.send(500, err);
    });
  };

  exports.reGenerate = function(req, res) {
    return authentication.Token.kill(req.user, req.params.type, req.params.set).then(function() {
      return authentication.Token.generate(req.user, req.params.type, req.params.set);
    }).then(function(key) {
      return res.send(200, key);
    }).fail(function(err) {
      return res.send(500, err);
    });
  };

  exports.kill = function(req, res) {
    return authentication.Token.kill(req.user, req.params.type, req.params.set).then(function() {
      return res.send(204);
    }).fail(function(err) {
      return res.send(500, err);
    });
  };

}).call(this);
