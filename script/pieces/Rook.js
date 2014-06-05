/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
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