define([ "..", ".", "lib", "./Piece" ], function( chess, pieces, lib, Piece ){

	pieces.Rook = lib.declare( [ Piece ], {
		type: "Rook",
		
		movement: function( ){
			return this.inherited( arguments, [[
				[ this.x,  Infinity ],
				[ this.x, -Infinity ],
				[ Infinity,  this.y ],
				[ -Infinity, this.y ]
			]]);			
		}
	});
	
	return pieces.Rook;
});