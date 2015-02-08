(function() {
  var pkg;

  pkg = require('../../../../package.json');

  exports.register = function(server) {
    return server.get("/api/metadata", exports.metadata);
  };

  exports.metadata = function(req, res) {
    return res.send(200, {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      homepage: "http://elementjs.nz/"
    });
  };

}).call(this);
