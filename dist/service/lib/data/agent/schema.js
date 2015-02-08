(function() {
  var BadRequestError, NotFoundError, ObjectId, Q, Schema, bcrypt, exports, mongoose, restify, uuid;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  uuid = require('node-uuid');

  ObjectId = mongoose.Schema.Types.ObjectId;

  Q = require('q');

  bcrypt = require('bcrypt');

  restify = require('restify');

  NotFoundError = restify.NotFoundError, BadRequestError = restify.BadRequestError;

  module.exports = exports = new Schema({
    username: {
      type: String,
      required: true
    },
    password: String,
    api_key: String,
    create_date: {
      type: Date,
      "default": Date.now
    },
    organization_id: {
      type: ObjectId,
      required: true
    },
    disabled: Boolean,
    uuid: {
      type: String,
      "default": function() {
        return uuid.v4();
      }
    }
  });

  exports.methods.toJSON = function() {
    return {
      username: this.username,
      create_date: this.create_date,
      disabled: this.disabled,
      unique_key: this.uuid
    };
  };

  exports.methods.verifyPassword = function(password) {
    var deferred;
    if (this.password == null) {
      return Q.reject(new BadRequestError());
    }
    deferred = Q.defer();
    bcrypt.compare(password, this.password, (function(_this) {
      return function(err, result) {
        if (err || !result) {
          return deferred.reject(new BadRequestError());
        }
        return deferred.resolve(_this);
      };
    })(this));
    return deferred.promise;
  };

  exports.statics.findByUsername = function(username) {
    var callback, deferred;
    if (username == null) {
      return Q.reject(new NotFoundError());
    }
    deferred = Q.defer();
    callback = function(err, doc) {
      if (err || !(doc != null ? doc.length : void 0)) {
        return deferred.reject(new NotFoundError());
      }
      return deferred.resolve(doc[0]);
    };
    this.find({
      username: username
    }, callback);
    return deferred.promise;
  };

}).call(this);
