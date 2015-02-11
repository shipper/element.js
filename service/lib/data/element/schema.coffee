mongoose    = require( 'mongoose' )
Schema      = mongoose.Schema
ObjectId    = mongoose.Schema.Types.ObjectId
uuid        = require( 'node-uuid' )

module.exports = exports = new Schema(

  type_id: ObjectId
  type_revision_map_key: String
  type_revision_map_id: ObjectId
  type_revision: Number

  data:
    content_type:
      type: String
      required: true
    data:
      type: Buffer
  published: Boolean
  publish_date: Date

  organization_id:
    type: ObjectId
    required: true
  revision_map_id:
    type: ObjectId
    required: true
  revision_map_key: String
  revision: Number
  revision_key: String
  library: String

)