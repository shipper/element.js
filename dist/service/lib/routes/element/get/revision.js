(function() {
  var ElementRevision;

  ElementRevision = (function() {
    ElementRevision.prototype.revision = 0;

    ElementRevision.prototype.base_id = null;

    ElementRevision.prototype.uuid = null;

    ElementRevision.prototype.create_date = null;

    function ElementRevision(data) {
      if (data == null) {
        data = void 0;
      }
      if (data != null) {
        this.revision = data.revision;
        this.base_id = data.base_id;
        this.uuid = data.uuid;
        this.create_date = data.create_date;
      }
    }

    ElementRevision.prototype.toJSON = function() {
      return {
        revision: this.revision,
        unique_key: this.uuid,
        create_date: this.create_date
      };
    };

    return ElementRevision;

  })();

  module.exports = ElementRevision;

}).call(this);
