var gulp            = require( 'gulp' ),
    coffee          = require( 'gulp-coffee' ),
    mkDir           = require( 'mkdirp'),
    rimRaf          = require( 'gulp-rimraf'),
    path            = require( 'path'),
    concat          = require( 'gulp-concat'),
    inject          = require( './control/inject'),
    jade            = require( 'gulp-jade'),
    cheerio         = require( 'cheerio'),
    fs              = require( 'fs'),
    glob            = require( 'glob'),
    less            = require( 'gulp-less'),
    _               = require( 'lodash' );



gulp.task('control:clean', function(){
    return gulp.src( path.join( 'dist', 'control' ) )
        .pipe( rimRaf( { force: true } ));
});

gulp.task('service:clean', function(){
    return gulp.src( path.join( 'dist', 'service' ) )
        .pipe( rimRaf( { force: true } ));
});

gulp.task('clean', [ 'control:clean', 'service:clean' ] );

gulp.task( 'control:make', [ 'control:clean' ], function(done){
    mkDir( 'dist/control', done );
});

gulp.task( 'service:make', [ 'service:clean' ], function(done){
    mkDir( 'dist/service', done );
});

gulp.task( 'make', [ 'control:make', 'service:make' ] );

gulp.task('control:coffee', [ 'control:make' ], function(){
    return gulp.src( path.join( 'control', '**', '*.coffee' ) )
        .pipe( coffee( { bare: false } ) )
        .pipe( gulp.dest( path.join( 'dist', 'control' ) ) );
});

gulp.task('service:coffee', [ 'service:make' ], function(){
    return gulp.src( path.join( 'service', '**', '*.coffee' ) )
        .pipe( coffee( { bare: false } ) )
        .pipe( gulp.dest( path.join( 'dist', 'service' ) ) );
});

gulp.task('coffee', [ 'control:coffee', 'service:coffee' ] );

gulp.task('jade', [ 'control:make' ], function(){
    return gulp.src( path.join( 'control', '**', '*.jade' ) )
        .pipe( jade( ) )
        .pipe( gulp.dest( path.join( 'dist', 'control' ) ) )
});

gulp.task('less', [ 'control:make' ], function(){
    return gulp.src( path.join( 'control', 'less', 'main.less' ) )
        .pipe( less( ) )
        .pipe( gulp.dest( path.join( 'dist', 'control', 'styles' ) ) )
});

gulp.task('inject:clone:scripts', [ 'control:clean' ], function(){
    return gulp.src( inject.scripts )
        .pipe( gulp.dest( path.join( 'dist', 'control', 'vendor' ) ))
});

gulp.task('inject:clone:styles', [ 'control:clean' ], function(){
    return gulp.src( inject.styles )
        .pipe( gulp.dest( path.join( 'dist', 'control', 'styles', 'vendor' ) ))
});

gulp.task('inject:clone', [ 'inject:clone:scripts', 'inject:clone:styles' ] );

function injectTags( directory, type, getTag, element, done, order ) {

    order = order || [ ];

    for( var i = 0; i < order.length; i++) {
        order[ i ] = path.basename( order[ i ] )
    }

    onFiles = function( $, files ) {

        var $element = $( element );

        var result = { };

        _.each( files, function( file, index ) {
            basename = path.basename( file );
            position = order.indexOf( basename );
            if( position === -1 ) {
                position = order.length + index;
            }
            result[ position ] = file;
        });

        var keys = _.keys( result ).sort( function( a, b ) {
            return a - b;
        });

        _.map( keys, function( key ) {
            return result[ key ]
        })
        .forEach( function( file ) {
            file = path.relative( path.join( 'dist', 'control' ), file );

            var tag = getTag( file );

            if( !tag ){
                return
            }

            $element.append( tag );
        });

        fs.writeFile( path.join( 'dist', 'control', 'index.html'), $.html(), function(){
            done( );
        });
    };

    onFile = function( err, file ) {
        if( err ) {
            return done( err );
        }

        var $ = cheerio.load( file );

        if( directory.substr( directory.length - type.length ) !== type ) {
            directory = path.join( directory, "**", "*." + type )
        }

        glob( directory, function( err, files ) {
            if( err ) {
                return done( err );
            }
            onFiles( $, files )
        });

    };

    fs.readFile( path.join( 'dist', 'control', 'index.html' ), onFile);


}

gulp.task('inject:tags:vendor', [ 'inject:clone' ], function(done){
    function getTag( file ) {
        return "<script type='application/javascript' src='" + file + "'></script>"
    }

    injectTags( path.join( 'dist', 'control', 'vendor' ), 'js', getTag, 'body', done, inject.scripts );
});

gulp.task('inject:tags:app', [ 'coffee', 'inject:tags:vendor' ], function(done){
    function getTag( file ) {
        return "<script type='application/javascript' src='" + file + "'></script>"
    }

    var app = function(err){
        if( err ) {
            done( err )
        }
        injectTags( path.join( 'dist', 'control', 'app' ), 'js', getTag, 'body', done )
    };

    injectTags( path.join( 'dist', 'control', 'common' ), 'js', getTag, 'body', app );
});

gulp.task('inject:tags:style:vendor', [ 'less', 'inject:tags:app' ], function(done){
    function getTag( file ) {
        return "<link rel='stylesheet' type='text/css' href='" + file + "'/>"
    }

    injectTags( path.join( 'dist', 'control', 'styles', 'vendor' ), 'css', getTag, 'head', done );
});

gulp.task('inject:tags:style', [ 'less', 'inject:tags:style:vendor' ], function(done){
    function getTag( file ) {
        return "<link rel='stylesheet' type='text/css' href='" + file + "'/>"
    }

    injectTags( path.join( 'dist', 'control', 'styles', 'main.css' ), 'css', getTag, 'head', done );
});

gulp.task('inject:tags', [ 'inject:tags:vendor', 'inject:tags:app', 'inject:tags:style' ] );

gulp.task('inject', [ 'inject:clone', 'inject:tags' ] );


gulp.task('assets:clone:vendor', [ 'control:make' ], function(){
    return gulp.src( inject.assets )
        .pipe( gulp.dest( path.join( 'dist', 'control', 'assets', 'vendor') ))
});

gulp.task('assets:clone', [ 'assets:clone:vendor', 'control:make' ], function(){
    return gulp.src( path.join( 'control', 'assets', '**', '*.*') )
        .pipe( gulp.dest( path.join( 'dist', 'control', 'assets') ))
});

gulp.task('json:clone', [ 'service:make' ], function(){
    return gulp.src( path.join( 'service', '**', '*.json') )
        .pipe( gulp.dest( path.join( 'dist', 'service' ) ))
});

gulp.task('control:build', [ 'control:clean', 'control:make', 'control:coffee', 'jade', 'inject', 'assets:clone'] );
gulp.task('service:build', [ 'service:clean', 'service:make', 'service:coffee', 'json:clone' ] );

gulp.task('build', [ 'control:build', 'service:build' ] );


gulp.task( 'control', [ 'control:build' ] );
gulp.task( 'service', [ 'service:build' ] );

gulp.task('default', [ 'build' ] );

