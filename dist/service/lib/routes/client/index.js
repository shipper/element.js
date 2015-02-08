(function() {
  var restify;

  restify = require('restify');

  exports.register = function(server) {
    var directory, serve;
    directory = './dist/client';
    serve = restify.serveStatic({
      directory: directory
    });
    return server.get(/\/?client\/(.*\.js)/, function(req, res, next) {
      var newReq, path, regex;
      regex = /\/?client\/(.*\.js)/;
      path = regex.exec(req.path())[1];
      newReq = {
        path: function() {
          return path;
        },
        method: 'GET',
        acceptsEncoding: req.acceptsEncoding
      };
      return serve(newReq, res, next);
    });
  };

}).call(this);
