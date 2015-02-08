(function() {
  var Q;

  Q = require('q');

  module.exports = function(scope, func, args) {
    var callback, deferred, i, newArgs;
    newArgs = [];
    i = 2;
    while (i < arguments.length) {
      newArgs.push(arguments[i]);
      i++;
    }
    deferred = Q.defer();
    callback = function(err, result) {
      if (err) {
        return deferred.reject(err);
      }
      return deferred.resolve(result);
    };
    newArgs.push(callback);
    func.apply(scope, newArgs);
    return deferred.promise;
  };

}).call(this);
