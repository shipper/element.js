mongoose  = require( '../mongoose' )
Q         = require( 'q' )
promisify = require( '../promisify' )

exports.define = ( name, schema ) ->

  schema.methods.savePromise = ->
    return promisify( this, this.save )

  schema.methods.removePromise = ->
    return promisify( this, this.remove )

  schema.statics.findByIdPromise = ( id ) ->
    return promisify( this, this.findById, id  )

  schema.statics.fetch = schema.statics.findByIdPromise

  schema.statics.findByUUID = ( uuid ) ->
    deferred = Q.defer( )

    callback = ( err, docs ) ->
      if err
        return deferred.reject( err )
      unless docs?.length is 1
        return deferred.reject( new Error( 'Invalid UUID' ) )
      return deferred.resolve(
        docs[ 0 ]
      )

    Type.find(
      {
        uuid: uuid
      },
      callback
    )

    return deferred.promise

  Type = mongoose.model(
    name,
    schema
  )

  return Type

