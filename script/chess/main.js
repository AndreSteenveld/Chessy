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

