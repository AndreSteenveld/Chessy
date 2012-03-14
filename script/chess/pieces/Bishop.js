define([ "..", ".", "lib", "./Piece" ], function( chess, pieces, lib, Piece ){

	pieces.Bishop = lib.declare( [ Piece ], {
		type: "Bishop",
		
		movement: function( ){
			return this.inherited( arguments, [[
				[  Infinity,  Infinity ],
				[ -Infinity, -Infinity ],
				[  Infinity, -Infinity ],
				[ -Infinity,  Infinity ] 
			]]);			
		}
	});
	
	return pieces.Bishop;
});