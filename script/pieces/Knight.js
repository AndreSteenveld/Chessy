/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "..", ".", "lib", "./Piece" ], function( chess, pieces, lib, Piece ){

	pieces.Knight = lib.declare( [ Piece ], {
		type: "Knight",
		
		movement: function( ){
			return this.inherited( arguments, [[
				[ this.x + 2, this.y + 1 ],
				[ this.x + 2, this.y - 1 ],
				[ this.x - 2, this.y + 1 ],
				[ this.x - 2, this.y - 1 ],
				[ this.x + 1, this.y + 2 ],
				[ this.x + 1, this.y - 2 ],
				[ this.x - 1, this.y + 2 ],
				[ this.x - 1, this.y - 2 ]
			]]);			
		}
	});
	
	return pieces.Knight;
});