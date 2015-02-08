
/*
  getHash: function (value) {
                /// <description>Creates a sdbm hash using the JSON representation of the value</description>
                /// <param name="value" type="Any"/>
                /// <returns type="Number" />
                value = JSON.stringify(value);
                /// Obtained from http://www.cse.yorku.ca/~oz/hash.html
                var hash = 0;
                var tempChar;
                for (var i = 0; i < value.length; i++) {
                    hash = value.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
                }
                return hash;
            }
 */

(function() {
  var getHash;

  getHash = function(value) {
    var hash, i;
    value = JSON.stringify(value);
    hash = 0;
    i = 0;
    while (i < value.length) {
      hash = value.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
      i += 1;
    }
    return hash;
  };

  this.getHash = getHash;

}).call(this);
