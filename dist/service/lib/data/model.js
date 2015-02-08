(function() {
  var Q, mongoose, promisify;

  mongoose = require('../mongoose');

  Q = require('q');

  promisify = require('../promisify');

  exports.define = function(name, schema) {
    var Type;
    schema.methods.savePromise = function() {
      return promisify(this, this.save);
    };
    schema.methods.removePromise = function() {
      return promisify(this, this.remove);
    };
    schema.statics.findByIdPromise = function(id) {
      return promisify(this, this.findById, id);
    };
    schema.statics.fetch = schema.statics.findByIdPromise;
    schema.statics.findByUUID = function(uuid) {
      var callback, deferred;
      deferred = Q.defer();
      callback = function(err, docs) {
        if (err) {
          return deferred.reject(err);
        }
        if ((docs != null ? docs.length : void 0) !== 1) {
          return deferred.reject(new Error('Invalid UUID'));
        }
        return deferred.resolve(docs[0]);
      };
      Type.find({
        uuid: uuid
      }, callback);
      return deferred.promise;
    };
    Type = mongoose.model(name, schema);
    return Type;
  };

}).call(this);
