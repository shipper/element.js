(function() {
  var Schema, mongoose, uuid;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  uuid = require('node-uuid');

  module.exports = new Schema({
    name: {
      type: String,
      required: true
    },
    create_date: {
      type: Date,
      "default": Date.now
    },
    disabled: Boolean,
    uuid: {
      type: String,
      "default": function() {
        return uuid.v4();
      }
    }
  });

}).call(this);
