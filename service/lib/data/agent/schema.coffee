mongoose = require( 'mongoose' )
Schema   = mongoose.Schema
uuid     = require( 'node-uuid' )
ObjectId = mongoose.Schema.Types.ObjectId
Q        = require( 'q' )
bcrypt   = require( 'bcrypt' )
restify  = require( 'restify' )

{
  NotFoundError,
  BadRequestError
} = restify

module.exports = exports = new Schema(
  username:
    type: String
    required: true
  password: String
  api_key: String
  create_date:
    type: Date
    default: Date.now
  organization_id:
    type: ObjectId
    required: true
  disabled: Boolean
  uuid:
    type: String
    default: ->
      return uuid.v4( )
)

exports.methods.toJSON = ->
  return {
    username: this.username,
    create_date: this.create_date
    disabled: this.disabled
    unique_key: this.uuid
  }

exports.methods.verifyPassword = ( password ) ->

  unless @password?
    return Q.reject( new BadRequestError( ) )

  deferred = Q.defer( )

  bcrypt.compare( password, @password, ( err, result ) =>
    if err or not result
      return deferred.reject( new BadRequestError( ) )
    deferred.resolve( @ )
  )

  return deferred.promise

exports.statics.findByUsername = ( username ) ->

  unless username?
    return Q.reject( new NotFoundError( ) )

  deferred = Q.defer( )

  callback = ( err, doc ) ->
    if err or not doc?.length
      return deferred.reject( new NotFoundError( ) )
    return deferred.resolve( doc[ 0 ] )

  this.find(
    username: username,
    callback
  )

  return deferred.promise
