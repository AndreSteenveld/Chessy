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
    
        if( typeof obj[ key ] === "function" ){
        
            result[ key ] = function( test ){
            
                var deferred = RSVP.defer( );
            
                deferred.promise
                    .then( obj[ key ].bind( this ) )
                    .then( 
                        test.done,
                        test.done 
                    );
                
                deferred.resolve( test );
                
            }                                    
            
        } else {
            
            wrap( obj[ key ] );    
        
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
    }    
});
 
/* 
define([ "dojo", "doh" ], function( dojo, doh ){
	
	dojo.extend( doh.Deferred, {
		
		resolve: doh.Deferred.prototype.callback,
		reject: doh.Deferred.prototype.errback,
		then: function( ){ return this.addCallbacks.apply( this, arguments ); }
	});
	
	require({ 
		packages: [
			{ name: "lib",    location: "../../script/lib" },
			{ name: "chess",  location: "../../script/chess" }
		]
	});
		
	var start = ( new Date( ) ).getTime( );

	try {
		// Do the require methods etc return a deferred
		require( [ "chess/tests/piece_lines_of_sight" ], function( ){ console.info( "Completed line of sight tests (" + ( ( new Date( ) ).getTime( ) - start ) + "ms)" ); } );
		require( [ "chess/tests/piece_movement" ], function( ){ console.info( "Completed movement tests (" + ( ( new Date( ) ).getTime( ) - start ) + "ms)" ); } );
		require( [ "chess/tests/board" ], function( ){ console.info( "Completed board tests (" + ( ( new Date( ) ).getTime( ) - start ) + "ms)" ); } );
		require( [ "chess/tests/game" ], function( ){ console.info( "Completed game tests (" + ( ( new Date( ) ).getTime( ) - start ) + "ms)" ); } );
		require( [ "chess/tests/player_and_random_ai" ], function( ){ console.info( "Completed random AI tests (" + ( ( new Date( ) ).getTime( ) - start ) + "ms)" ); } );
	
	
	} catch( exception ){
		console.error( "An error occured during the testing ::", exception );
	
	} finally {
	
		
	}

});
*/