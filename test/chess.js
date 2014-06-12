/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var nu   = require( "nodeunit" ),
    RSVP = require( "rsvp" );
    
function wrap( obj ){
    
    var result = { };
    
    Object.keys( obj ).forEach( function( key ){
    
        if( /^(setUp|tearDown)$/.test( key ) ){
            
            result[ key ] = obj[ key ];
        
        } else if( typeof obj[ key ] === "function" ){
        
            result[ key ] = function( test ){
            
                var deferred = RSVP.defer( "TEST :: " + key );
            
                deferred.promise
                    .then( obj[ key ].bind( this ) )
                    .catch(
                        function( result ){
                            test.fail( result );
                            return result;
                        }
                    )
                    .then( function( result ){ 
                        result instanceof Error 
                            ? test.done( result )
                            : test.done( );
                    });
                
                deferred.resolve( test );
                
            }                                    
            
        } else {
            
            result[ key ] = wrap( obj[ key ] );    
        
        }    
        
    });
    
    return result;
    
}

process.chdir( __dirname );

nu.reporters.default.run({
    "Board": wrap( require( "./board.js" ) ),
    "Pieces": {
        "Line of sight": wrap( require( "./piece_lines_of_sight.js" ) ),
        "Movement":      wrap( require( "./piece_movement.js" ) )        
    },
    "Stateful": {
        "Game": wrap( require( "./game.js" ) )    
        
    }
});