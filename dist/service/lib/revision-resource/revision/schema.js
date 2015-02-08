(function() {
  var ObjectId, Schema, exports, mongoose, uuid;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  uuid = require('node-uuid');

  ObjectId = mongoose.Schema.Types.ObjectId;

  module.exports = exports = new Schema({
    revisions: [
      {
        revision: {
          type: Number,
          required: true,
          "default": function() {
            return 0;
          }
        },
        create_date: {
          type: Date,
          required: true,
          "default": Date.now
        },
        delete_date: {
          type: Date
        },
        key: {
          type: String,
          required: true,
          "default": function() {
            return uuid.v4();
          }
        },
        external_id: {
          type: ObjectId,
          required: true
        }
      }
    ],
    create_date: {
      type: Date,
      required: true,
      "default": Date.now
    },
    delete_date: {
      type: Date
    },
    organization_id: {
      type: ObjectId,
      required: true
    },
    key: {
      type: String,
      required: true,
      "default": function() {
        return uuid.v4();
      }
    }
  });

}).call(this);
