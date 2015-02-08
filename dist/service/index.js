(function() {
  var ElementInstance;

  ElementInstance = require('./lib/instance');

  new ElementInstance().start().then(function() {
    return console.log('Started server');
  });

}).call(this);
