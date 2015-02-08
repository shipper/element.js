mongoose = require( 'mongoose' )
Schema   = mongoose.Schema
ObjectId = mongoose.Schema.Types.ObjectId
uuid     = require( 'node-uuid' )
schemajs = require( 'schemajs' )
Q        = require( 'q' )
_        = require( 'lodash' )
restify  = require( 'restify' )
Base     = require( './base.json' )

{
  UnauthorizedError,
} = restify

module.exports = exports = new Schema(
  name: String
  description: String
  definition: { }
  create_date:
    type: Date
    required: true
    default: ->
      return new Date( )
  key:
    type: String
    required: true
    default: ->
      return uuid.v4( )
  uuid:
    type: String
    required: true
    default: ->
      return uuid.v4( )
  organization_id: ObjectId
)

# string+, string (empty string allowed), alpha, alphanum, email, object, array, date, number, int, boolean, url, zipcode



exports.statics.Base = Base

exports.statics.getDefinition = ( id, organization_id = undefined ) ->
  deferred = Q.defer( )

  this.findById( id, ( err, type ) ->
    if err
      return deferred.reject( err )

    if (
      type.organization_id? and
      type.organization_id isnt organization_id
    )
      return deferred.reject( new UnauthorizedError( ) )

    type
    .getDefinition()
    .then( deferred.resolve )
    .fail( deferred.reject )
  )

  return deferred.promise

exports.methods.getDefinition = ->
  schema = { }

  promises = [ ]

  definition = _.cloneDeep( @definition )

  renameSchema = ( parent, key_c, obj ) ->
    result = undefined
    unless _.isObject( obj )

      result = obj

    else if _.isArray( obj )

      result = [ ]

      for value, index in obj
        renameSchema( result, index, value )

    else if _.isPlainObject( obj )

      result = { }

      for own key_b, value_b of obj

        res_key = if key_b.toLowerCase( ) is 'definition' then 'schema' else key_b

        renameSchema( result, res_key, value_b )

    unless _.isObject( parent ) and key_c?
      return result

    parent[ key_c ] = result

    return parent

  schema = renameSchema( null, null, definition )

  findRefs = ( schema ) =>
    promises = [ ]

    unless _.isPlainObject( schema )
      return Q.resolve( )

    for own key_a, value_a of schema
      unless value_a?.$ref?
        promises.push(
          findRefs( schema[ key_a ] )
        )
        continue
      promise = this.constructor.getDefinition(
        value_a.$ref,
        @organization_id
      )
      .then( ( child ) ->
        schema[ key_a ] = child.schema
      )

      promises.push( promise )


    unless promises.length
      return Q.resolve( )

    return Q.all( promise )

  _.each( _.keys( @schema ), ( key ) =>
    promise = findRefs( @schema[ key ] )
    promises.push( promise )
  )

  if promises.length is 0
    return Q.resolve( schema )
  return Q.all(
    promises
  )
  .then( ->
    return schema
  )

exports.methods.validateData = ( data ) ->
  return this.getDefinition( )
  .then( ( schema ) ->
    form = schema.validate( data )
    unless form.valid
      throw new Error( JSON.stringify( form.errors ) )
    return form.data
  )



