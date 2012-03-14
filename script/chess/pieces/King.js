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