/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "..", ".", "lib", "./Piece" ], function( chess, pieces, lib, Piece ){

	pieces.Pawn = lib.declare( [ Piece ], {
		type: "Pawn",
		
		enPassant: null,
		
		constructor: function( _pawn_ ){
			_pawn_.enPassant && ( this.enPassant = _pawn_.enPassant );
		},
		 
		movement: function( ){
			
			var movement = [[ this.x, this.y + 1 ]];
			
			// If we are on the second row we are aloud to move two fields
			if( this.y === 1 ){
				movement.push( [ this.x, this.y + 2 ] );
				
				// Update the possible pawns that are looking to our traveling fields and update them
				// so they kan en passant us.				
				   this.board.fields[ this.x + 1 ]
				&& this.board.fields[ this.x + 1 ][ this.y + 2 ].piece
				&& this.board.fields[ this.x + 1 ][ this.y + 2 ].piece.color !== this.color
				&& this.board.fields[ this.x + 1 ][ this.y + 2 ].piece.instanceOf( pieces.Pawn )
				&& ( this.board.fields[ this.x + 1 ][ this.y + 2 ].piece.enPassant = this.board.fields[ this.x ][ this.y + 1 ] );
				
				   this.board.fields[ this.x - 1 ]
				&& this.board.fields[ this.x - 1 ][ this.y + 2 ].piece
				&& this.board.fields[ this.x - 1 ][ this.y + 2 ].piece.color !== this.color
				&& this.board.fields[ this.x - 1 ][ this.y + 2 ].piece.instanceOf( pieces.Pawn )
				&& ( this.board.fields[ this.x - 1 ][ this.y + 2 ].piece.enPassant = this.board.fields[ this.x ][ this.y + 1 ] );				
			}
			
			if( this.board.fields[ this.x + 1 ] && this.board.fields[ this.x + 1 ][ this.y + 1 ] ){
				
				   this.board.fields[ this.x + 1 ][ this.y + 1 ].piece
				&& this.board.fields[ this.x + 1 ][ this.y + 1 ].piece.color !== this.color
				&& movement.push( [ this.x + 1, this.y + 1 ] );
				
			}
			
			if( this.board.fields[ this.x - 1 ] && this.board.fields[ this.x - 1 ][ this.y + 1 ] ){
				
				   this.board.fields[ this.x - 1 ][ this.y + 1 ].piece
				&& this.board.fields[ this.x - 1 ][ this.y + 1 ].piece.color !== this.color
				&& movement.push( [ this.x - 1, this.y + 1 ] );
				
			}
			
			return this.inherited( arguments, [ movement ] );
			
		},
		
		relations: function( ){
			var pieces = this.inherited( arguments );
			
			if( this.y === 4 ){
				   this.board[ this.x - 1 ][ this.y ].piece
				&& this.board[ this.x - 1 ][ this.y ].piece.color !== this.color
				&& this.board[ this.x - 1 ][ this.y ].piece.type === "Pawn"
				&& this.board[ this.x - 1 ][ this.y ].piece.enPassant.indexOf( this.board[ this.x ][ this.y - 1] ) !== -1
				&& pieces.push( this.board[ this.x - 1 ][ this.y ].piece );
				
				   this.board[ this.x + 1 ][ this.y ].piece
				&& this.board[ this.x + 1 ][ this.y ].piece.color !== this.color
				&& this.board[ this.x + 1 ][ this.y ].piece.type === "Pawn"
				&& this.board[ this.x + 1 ][ this.y ].piece.enPassant.indexOf( this.board[ this.x ][ this.y - 1] ) !== -1
				&& pieces.push( this.board[ this.x + 1 ][ this.y ].piece );
			}	
			
			return pieces;			
		}
		
	});
	
	return pieces.Pawn;	
});