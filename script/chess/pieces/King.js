/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "..", ".", "lib", "./Piece" ], function( chess, pieces, lib, Piece ){

	pieces.King = lib.declare( [ Piece ], {
		type: "King",
		
		castled: false,
		
		constructor: function( _king_ ){
			"castled" in _king_ && ( this.castled = _king_.castled );
		},
		
		movement: function( ){
			
			var color  = this.color,
				board  = this.board[ color ],
				fields = [
					[ this.x, this.y + 1 ],
					[ this.x, this.y - 1 ],
					[ this.x + 1, this.y ],
					[ this.x - 1, this.y ],
					[ this.x + 1, this.y + 1 ],
					[ this.x - 1, this.y - 1 ],
					[ this.x + 1, this.y - 1 ],
					[ this.x - 1, this.y + 1 ] 
				];
		
			// We are only aloud to castle once in the entire game and only if we are on
			// the starting field and are not checked.
			// For castleing rules check: http://en.wikipedia.org/wiki/Castling
			if(    !this.castled 
				&& this.field === board[ 4 ][ 0 ] 
				&& this.attackedBy( ).length === 0	
			){
			
				// 1. First check if there is a piece in the corner
				// 2. Check for type and color
				// 3. There are no other pieces crossing our paths or
				//    enemy pieces looking at the fields we want to cross
				// 4. Push the field we would move to into the possabolities
				//
				// Do the same for the otherside...
				   board[ 0 ][ 0 ].piece
				&& board[ 0 ][ 0 ].piece.color === this.color
				&& board[ 0 ][ 0 ].piece.type === "Rook"
				&& [
				       board[ 2 ][ 0 ],
				       board[ 3 ][ 0 ]
				   ].every( function( field ){
						return !field.piece
							&& field.looking.every( function( piece ){ return piece.color === color; } );					
				   })
				&& fields.push( [ this.x - 2, this.y ] );
				
				   board[ 7 ][ 0 ].piece
				&& board[ 7 ][ 0 ].piece.color === this.color
				&& board[ 7 ][ 0 ].piece.type === "Rook"
				&& [
				       board[ 5 ][ 0 ],
				       board[ 6 ][ 0 ]
				   ].every( function( field ){
						return !field.piece
							&& field.looking.every( function( piece ){ return piece.color === color; } );					
				   })
				&& fields.push( [ this.x + 2, this.y ] );
				
			}
			
			return this.inherited( arguments, [ fields ] )
				.filter( function( field ){
					
					return field.looking.every( function( watcher ){
						
						return watcher.color === color;
						
					});
					
				});
			
		},
		
		move: function( toField ){
			if( this.field === this.board[ this.color ][ 0 ][ 4 ] ){
			
				if( toField === this.board[ this.color ][ 0 ][ 2 ] ){
					// We are castleing left
					this.board[ this.color ][ 0 ][ 0 ].move( this.board[ this.color ][ 0 ][ 3 ] );
					this.castled = true;
					
				} else if( toField === this.board[ this.color ][ 0 ][ 6 ] ){
					// We are castleing right
					this.board[ this.color ][ 0 ][ 7 ].move( this.board[ this.color ][ 0 ][ 5 ] );
					this.castled = true;
					
				}
			}	
			
			return this.inherited( arguments );
		}
	});
	
	return pieces.King;
});