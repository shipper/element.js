(function() {
  var ElementRevisionResource, RevisionResource, Schema,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Schema = require('../../data/element/schema');

  RevisionResource = require('../index');

  ElementRevisionResource = (function(_super) {
    __extends(ElementRevisionResource, _super);

    function ElementRevisionResource() {
      ElementRevisionResource.__super__.constructor.call(this, 'Element', Schema);
    }

    return ElementRevisionResource;

  })(RevisionResource);

  module.exports = new ElementRevisionResource();

}).call(this);
