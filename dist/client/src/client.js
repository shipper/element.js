(function() {
  var ElementClient;

  ElementClient = (function() {
    function ElementClient(_at_host) {
      this.host = _at_host != null ? _at_host : 'http://elementjs.nz/';
      this.setQ(window.Q);
    }

    ElementClient.prototype.setQ = function(q) {
      if (!((q != null ? q.defer : void 0) instanceof Function)) {
        return;
      }
      return this.Q = q;
    };

    ElementClient.prototype.element = function(key) {
      var deferred;
      deferred = this.Q.defer();
      return deferred.promise;
    };

    return ElementClient;

  })();

  this.ElementClient = ElementClient;

}).call(this);
