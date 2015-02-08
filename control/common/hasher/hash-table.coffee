class HashTable
  @getHash = ( value ) ->
    hash = 0
    unless value?
      return hash

    value = JSON.stringify( value )

    i = 0
    while i < value.length
      hash = value.charCodeAt( i ) + ( hash << 6 ) + ( hash << 16 ) - hash
      i += 1

    return hash

  $$value: undefined
  $$hash: undefined

  constructor: ( @$$value ) ->
    @state( )

  state: ->
    @$$hash = @getHash( )
    @$$table = @generateTable( )

  getHash: ( value = @$$value ) ->
    return HashTable.getHash( value )

  isDirty: ->
    return @$$hash is @getHash( )

  generateTable: ( value = @$$value ) ->
    unless (
      _.isArray( value ) or
      _.isPlainObject( value )
    )
      return @getHash( value )

    params = _.keys( value )

    res = _.clone( value )

    for key in params
      res[ key ] = @generateTable( value[ key ] )

    return res

  flatten: ( obj ) ->

    unless _.isObject( obj )
      return obj

    params = _.keys( obj )

    res = { }

    for key in params
      children = @flatten( obj[ key ] )

      if children is obj[ key ]
        res[ key ] = obj[ key ]
        continue

      for own child_key, child_value of children
        res[ "#{ key }.#{ child_key }" ] = child_value

    return res

  getChanges: ->

    process = ( table, value ) =>
      if _.isNumber( table )
        return @getHash( value ) isnt table

      res = _.clone( value )

      params = _.keys( value )

      for key in params
        hash = table[ key ]
        unless hash?
          res[ key ] = true
          continue
        res[ key ] = process( table[ key ], value[ key ] )

      return res

    table = process( @$$table, @$$value )

    if typeof table is 'boolean'
      return table

    return @flatten( table )









this.HashTable = HashTable


