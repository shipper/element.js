(function() {
  var RevisionResource, Schema, TypeRevisionResource,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Schema = require('../../data/type/schema');

  RevisionResource = require('../index');

  TypeRevisionResource = (function(_super) {
    __extends(TypeRevisionResource, _super);

    function TypeRevisionResource() {
      TypeRevisionResource.__super__.constructor.call(this, 'Type', Schema);
    }

    return TypeRevisionResource;

  })(RevisionResource);

  module.exports = new TypeRevisionResource();

}).call(this);
