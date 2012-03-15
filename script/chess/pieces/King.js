/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "..", ".", "lib", "./Piece" ], function( chess, pieces, lib, Piece ){

	pieces.King = lib.declare( [ Piece ], {
		type: "King",
		
		movement: function( ){
			
			var color = this.color;
			
			return this.inherited( arguments, [[
					[ this.x, this.y + 1 ],
					[ this.x, this.y - 1 ],
					[ this.x + 1, this.y ],
					[ this.x - 1, this.y ],
					[ this.x + 1, this.y + 1 ],
					[ this.x - 1, this.y - 1 ],
					[ this.x + 1, this.y - 1 ],
					[ this.x - 1, this.y + 1 ] 
				]])
				.filter( function( field ){
					
					return field.looking.every( function( watcher ){
						
						return watcher.color === color;
						
					});
					
				});
		}
	});
	
	return pieces.King;
});