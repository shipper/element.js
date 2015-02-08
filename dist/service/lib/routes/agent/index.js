(function() {
  var Agent, authentication;

  authentication = require('../../authentication');

  Agent = require('../../data/agent');

  exports.register = function(server) {
    server.get('/api/agent/self', authentication, exports.get);
    return server.post('/api/agent/login', exports.login);
  };

  exports.login = function(req, res, next) {
    return Agent.findByUsername(req.body.username).then(function(agent) {
      return agent.verifyPassword(req.body.password);
    }).then(function(agent) {
      return authentication.Token.generate(agent);
    }).then(function(token) {
      return res.send(200, token);
    }).fail(function(error) {
      return next(error);
    });
  };

  exports.get = function(req, res) {
    return res.send(200, req.user);
  };

}).call(this);
