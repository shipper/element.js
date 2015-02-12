(function() {
  var Generate, exports;

  Generate = require('./generate');

  module.exports = exports = function(agent, type, set) {
    var _ref, _ref1, _ref2;
    if (type == null) {
      type = Generate.AUTHENTICATION;
    }
    if (set == null) {
      set = 'default';
    }
    if (!((type != null) && (set != null) && ((agent != null ? (_ref = agent.api) != null ? (_ref1 = _ref.keys) != null ? (_ref2 = _ref1[set]) != null ? _ref2[type] : void 0 : void 0 : void 0 : void 0) != null))) {
      return Q.resolve(this);
    }
    agent.api.keys[set][type] = void 0;
    return agent.savePromise();
  };

}).call(this);
