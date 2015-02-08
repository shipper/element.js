Q                = require( 'q' )
mongoose         = require( 'mongoose'   )
Revision         = require( './revision' )
RevisionArray    = require( './revision-array' )
uuid             = require( 'node-uuid' )
_                = require( 'lodash' )
ExternalRevision = require( './external-revision' )

class RevisionResources
  constructor: ( @name, @schema ) ->
    @$__buildModels( )

  $__buildModels: ->

    unless @schema.tree['revision_map_id']?
      throw new Error( "Schema does not include 'revision_map_id'")
    unless @schema.tree['revision_map_key']?
      throw new Error( "Schema does not include 'revision_map_key'")
    unless @schema.tree['revision']?
      throw new Error( "Schema does not include 'revision'")
    unless @schema.tree['revision_key']?
      throw new Error( "Schema does not include 'revision_key'")
    unless @schema.tree['organization_id']?
      throw new Error( "Schema does not include 'organization_id'")
    unless @schema.tree['id']?
      throw new Error( "Schema does not include 'id'")

    @model = mongoose.model( @name, @schema )
    @revisonModel = Revision.define( @name )

  create: ->
    return new @model( )

  find: ( key, org ) ->
    return @findRevision( key, -1, org )

  findRevision: ( key, revision = -1, org, key_type = 'key' ) ->

    if typeof revision is 'string'
      revision_num = parseInt( revision, 10 )
      unless isNaN( revision_num )
        revision = revision_num

    deferred = Q.defer( )

    findById_callback = ( err, document ) ->
      if err
        return deferred.reject( err )
      return deferred.resolve( document )

    @getRevisions( key, org, key_type = 'key' )
    .then( ( revisions ) =>

      revision_obj = null

      revision_key = if typeof revision is 'string' then 'key' else 'revision'

      for revision_possible in revisions
        if revision_key is 'revision' and revision is -1
          unless revision_obj?
            revision_obj = revision_possible
            continue
          unless revision_possible.revision > revision_possible
            continue
          revision_obj = revision_possible
          continue
        else if revision_possible[ revision_key ] is revision
          revision_obj = revision_possible
          break

      unless revision_obj?
        return deferred.reject( 'Not Found' )

      @model.findById(
        revision_obj.external_id,
        findById_callback
      )
    )
    .fail( deferred.reject )

    return deferred.promise

  getAll: ( org, reference = false ) ->

    deferred = Q.defer( )

    find_callback = ( err, documents ) =>
      if err
        return deferred.reject( err )

      documents = _.filter( documents, ( document ) ->
        return not document.delete_date?
      )

      latest = _.map( documents, ( document ) ->

        revision = null
        for this_revision in document.revisions
          unless revision?
            revision = this_revision
            continue
          unless revision.revision < this_revision.revision
            continue
          revision = this_revision

        return new ExternalRevision( document, revision )
      )

      unless reference
        return deferred.resolve( latest )

      revisions = [ ]

      promises = _.map( latest, ( revision ) =>
        return @findRevision( revision.document.id, revision.revision, org, 'id' )
        .then( ( doc ) ->
          revisions.push( doc )
        )
      )

      Q.all(
        promises
      )
      .then( ->
        deferred.resolve( revisions )
      )
      .fail( deferred.reject )



    @revisonModel.find(
      {
        organization_id: org
      },
      find_callback()
    )

    return deferred.promise

  getRevisions: ( key, org, key_type = 'key' ) ->

    unless key?
      return Q.resolve( new RevisionArray( new @revisonModel( ), [ ] ) )

    deferred = Q.defer( )

    find_callback = ( err, documents ) =>

      newModel = =>
        new_model = new @revisonModel( )

        if key_type is 'key'
          new_model.key = key

        new_model.organization_id = org

        return deferred.resolve(
          new RevisionArray( new_model, [ ] )
        )

      if err
        return newModel( )

      if key_type is 'id'
        return deferred.resolve( new RevisionArray( documents, documents.revisions ) )

      count = 0
      index = -1
      for document, document_index in documents
        if document.delete_date?
          continue
        count += 1
        index = document_index

      if count isnt 1
        return newModel( )

      document = documents[ index ]

      return deferred.resolve( new RevisionArray( document, document.revisions ) )

    method = if key_type is 'id' then 'findById' else 'find'

    options = if key_type is 'id' then key else {
      key: key,
      organization_id: org
    }

    @revisonModel[ method ](
      options,
      find_callback
    )

    return deferred.promise

  update: ( instance ) ->
    @save( instance )

  save: ( instance ) ->
    deferred = Q.defer( )

    @getRevisions( instance[ 'revision_map_id' ], instance.organization_id, 'id' )
    .then( ( revisions ) =>

      biggest_revision = -1
      for revision in revisions
        unless revision.revision > biggest_revision
          continue
        biggest_revision = revision.revision

      revision = biggest_revision + 1

      model = @create( )

      for key of @schema.tree
        if key in [
          '_id',
          'id'
        ]
          continue
        model[ key ] = instance[ key ]

      map_key = instance['revision_map_key'] or revisions.revision_model.key

      # Could be from the instance
      revisions.revision_model.key = map_key

      model['revision_map_id'] = revisions.revision_model
      model['revision_map_key'] = map_key
      model['revision'] = revision
      model['revision_key'] = uuid.v4( )

      revisions.push( model )

      revisions.revision_model.revisions.push({
        revision: revision,
        create_date: new Date(),
        key: model['revision_key'],
        external_id: model.id
      })

      revisions.revision_model.organization_id = model.organization_id

      save_model_callback = ( err ) ->
        if err
          return deferred.reject( err )

        return deferred.resolve( model )

      save_revisions_callback = ( err ) ->
        if err
          return deferred.reject( err )

        model.save( save_model_callback )


      revisions.revision_model.save( save_revisions_callback )
    )
    .fail( deferred.reject )

    return deferred.promise

  delete: ( instance ) ->
    deferred = Q.defer( )




    return deferred.promise







module.exports = RevisionResources