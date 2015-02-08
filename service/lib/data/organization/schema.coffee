mongoose = require( 'mongoose' )
Schema   = mongoose.Schema
uuid     = require( 'node-uuid' )

module.exports = new Schema(
  name:
    type: String
    required: true
  create_date:
    type: Date
    default: Date.now
  disabled: Boolean
  uuid:
    type: String
    default: ->
      return uuid.v4( )
)