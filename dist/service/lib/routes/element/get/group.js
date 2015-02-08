(function() {
  var ElementGroup;

  ElementGroup = (function() {
    ElementGroup.prototype.elements = void 0;

    ElementGroup.prototype.base_id = void 0;

    ElementGroup.prototype.key = void 0;

    ElementGroup.prototype.create_date = void 0;

    ElementGroup.prototype.update_date = void 0;

    ElementGroup.prototype.type = void 0;

    function ElementGroup(elements) {
      var first, last;
      if (elements == null) {
        elements = [];
      }
      this.elements = elements.sort(function(a, b) {
        return a.revision - b.revision;
      });
      first = this.elements[0];
      if (first == null) {
        return;
      }
      this.base_id = first.base_id;
      this.key = first.key;
      this.create_date = first.create_date;
      last = this.elements[this.elements.length - 1];
      this.update_date = last.create_date;
      this.type = last.type;
    }

    ElementGroup.prototype.toJSON = function() {
      return {
        create_date: this.create_date,
        update_date: this.update_date,
        key: this.key,
        revisions: this.elements.length
      };
    };

    return ElementGroup;

  })();

  module.exports = ElementGroup;

}).call(this);
