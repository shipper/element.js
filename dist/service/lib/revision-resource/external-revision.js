(function() {
  var ExternalRevision;

  ExternalRevision = (function() {
    function ExternalRevision(_at_document, _at_revision) {
      this.document = _at_document;
      this.revision = _at_revision;
    }

    ExternalRevision.prototype.toBSON = function() {
      return this.toJSON();
    };

    ExternalRevision.prototype.toJSON = function() {
      return {
        revision: this.revision.revision,
        revision_key: this.revision.key,
        key: this.document.key,
        document_create_date: this.document.create_date,
        create_date: this.revision.create_date
      };
    };

    return ExternalRevision;

  })();

  module.exports = ExternalRevision;

}).call(this);
