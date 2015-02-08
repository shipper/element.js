(function() {
  var BearerStrategy, validate;

  BearerStrategy = require('passport-http-bearer').Strategy;

  validate = require('./validate');

  exports._passport = null;

  exports._authenticate = null;

  exports.authenticate = function(req, res, next) {
    return exports._authenticate(req, res, next);
  };

  exports.register = function(passport) {
    exports._passport = passport;
    passport.use(exports.Strategy = new BearerStrategy(validate));
    return exports._authenticate = passport.authenticate('bearer', {
      session: false
    });
  };

}).call(this);
