/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
 
console.info( "The ches main file is being executed" );
 
define([ 
	".",       
	
	"./board/Board", 
	
	"./pieces/Pawn",
	"./pieces/Knight",
	"./pieces/Bishop",
	"./pieces/Rook",
	"./pieces/Queen",
	"./pieces/King"
	
], function( chess ){
	
	console.info( "The main dependencies have been loaded now we are going to finishup on the module." );
	
	//
	// The main chess module
	//
	
	chess.version = { 
		version: {
			major: 0,
			minor: 3,
			revision: 0,
			
			toString: function( ){
				return "[Chess version: " + this.major + "." + this.minor + "." + this.revision + "]";						
			}	
		}
	};

	return ( this.chess = chess );
});

