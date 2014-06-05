/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
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