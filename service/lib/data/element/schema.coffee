mongoose    = require( 'mongoose' )
Schema      = mongoose.Schema
ObjectId    = mongoose.Schema.Types.ObjectId
uuid        = require( 'node-uuid' )

module.exports = new Schema(
  type_name:
    type: String
    default: ->
      return 'Default'
  type_id: ObjectId
  data:
    content_type: String
    data: Buffer
  publish_revision:
    type: Number
    default: 0
  revision:
    type: Number
    default: 0
  base_id:
    type: ObjectId
  create_date:
    type: Date
    default: Date.now
  organization_id:
    type: ObjectId
    required: true
  key:
    type: String
    default: ->
      return uuid.v4( )
  uuid:
    type: String
    default: ->
      return uuid.v4( )
  published:
    type: Boolean
    default: ->
      return false
)