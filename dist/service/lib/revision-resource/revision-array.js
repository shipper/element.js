(function() {
  var ExternalRevision, Q, RevisionArray, _,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  ExternalRevision = require('./external-revision');

  _ = require('lodash');

  Q = require('q');

  RevisionArray = (function(_super) {
    __extends(RevisionArray, _super);

    function RevisionArray(_at_revision_model, revisions) {
      this.revision_model = _at_revision_model;
      if (revisions == null) {
        revisions = void 0;
      }
      RevisionArray.__super__.constructor.call(this);
      if (revisions instanceof Array) {
        _.map(revisions, (function(_this) {
          return function(revision) {
            return _this.push(revision);
          };
        })(this));
      }
    }

    RevisionArray.prototype.save = function() {
      var callback, deferred;
      deferred = Q.defer();
      this.revision_model.revisions = this;
      callback = (function(_this) {
        return function(err) {
          if (err) {
            return deferred.reject(err);
          }
          return deferred.resolve(_this);
        };
      })(this);
      this.revision_model.save(callback);
      return deferred.promise;
    };

    RevisionArray.prototype.toBSON = function() {
      return this.toJSON();
    };

    RevisionArray.prototype.toJSON = function() {
      var arr;
      arr = [];
      _.map(this, (function(_this) {
        return function(element) {
          return arr.push(new ExternalRevision(_this.revision_model, element));
        };
      })(this));
      return arr;
    };

    return RevisionArray;

  })(Array);

  module.exports = RevisionArray;

}).call(this);
