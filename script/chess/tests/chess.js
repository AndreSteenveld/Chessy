define([ ], function( ){
	
	require({ 
		packages: [
			{ name: "lib",    location: "../../../chess/script/game/lib" },
			{ name: "chess",  location: "../../../chess/script/game" }
		]
	});
		
	var start = ( new Date( ) ).getTime( );

	try {
		// Do the require methods etc return a deferred
		require( [ "chess/tests/piece_lines_of_sight" ], function( ){ console.info( "Completed line of sight tests (" + ( ( new Date( ) ).getTime( ) - start ) + "ms)" ); } );
		require( [ "chess/tests/piece_movement" ], function( ){ console.info( "Completed movement tests (" + ( ( new Date( ) ).getTime( ) - start ) + "ms)" ); } );
	
	
	} catch( exception ){
		console.error( "An error occured during the testing ::", exception );
	
	} finally {
	
		
	}

});