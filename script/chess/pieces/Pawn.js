/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "..", ".", "lib", "./Piece" ], function( chess, pieces, lib, Piece ){

	pieces.Pawn = lib.declare( [ Piece ], {
		type: "Pawn",
		
		enPassant: null,
		
		// The constructor in this case is quite special. We need to know the 
		// en passant pieces before the rest of initalization of the piece. 
		// Therefor we will need to execute this execute this constructor before
		// we do Piece#constructor
		"-chains-": { constructor: "manual" },
		constructor: function( _pawn_ ){
			this.enPassant = "enPassant" in _pawn_ ? _pawn_.enPassant : [ ];
			this.inherited( arguments );
		},
		 
		movement: function( ){
			
			var movement = [ ],
				fields   = this.board.fields;			
			
			// Check if we can move one field forward
			   fields[ this.x ][ this.y + 1 ] 
			&& fields[ this.x ][ this.y + 1 ].piece === null
			&& movement.push( [ this.x, this.y + 1 ] );
						
			// If we are on the second row we are aloud to move two fields but only
			// if the field in front of us is not occupied.
			if( this.y === 1 && movement.length ){
				movement.push( [ this.x, this.y + 2 ] );
				
				// Update the possible pawns that are looking to our traveling fields and update them
				// so they kan en passant us.				
				   fields[ this.x + 1 ]
				&& fields[ this.x + 1 ][ this.y + 2 ].piece
				&& fields[ this.x + 1 ][ this.y + 2 ].piece.color !== this.color
				&& fields[ this.x + 1 ][ this.y + 2 ].piece.isInstanceOf( pieces.Pawn )
				&& ( fields[ this.x + 1 ][ this.y + 2 ].piece.enPassant = fields[ this.x ][ this.y + 1 ] );
				
				   fields[ this.x - 1 ]
				&& fields[ this.x - 1 ][ this.y + 2 ].piece
				&& fields[ this.x - 1 ][ this.y + 2 ].piece.color !== this.color
				&& fields[ this.x - 1 ][ this.y + 2 ].piece.isInstanceOf( pieces.Pawn )
				&& ( fields[ this.x - 1 ][ this.y + 2 ].piece.enPassant = fields[ this.x ][ this.y + 1 ] );				
			}
			
			// If there is an enemy piece north east or north west of us add that field to the
			// the movement list aswell since we can capture it.
			if( fields[ this.x + 1 ] && fields[ this.x + 1 ][ this.y + 1 ] ){
				
				   fields[ this.x + 1 ][ this.y + 1 ].piece
				&& fields[ this.x + 1 ][ this.y + 1 ].piece.color !== this.color
				&& movement.push( [ this.x + 1, this.y + 1 ] );
				
			}
			
			if( fields[ this.x - 1 ] && fields[ this.x - 1 ][ this.y + 1 ] ){
				
				   fields[ this.x - 1 ][ this.y + 1 ].piece
				&& fields[ this.x - 1 ][ this.y + 1 ].piece.color !== this.color
				&& movement.push( [ this.x - 1, this.y + 1 ] );
				
			}
			
			// Check if we can hit an opponent en passant, if so add the diagonal fields even though
			// they are empty. They will not be added by the attack pieces because they are empty
			// otherwise the pawn we are attacking en passant couldn't have passed the field legally.
			//this.enPassant && movement.push.apply( movement, 
			//	this.enPassant.map( function( field ){
			//		return fields[ field.x ][ field.y + 1 ];
			//	})
			//);
			
			return this.inherited( arguments, [ movement ] );
			
		},
		
		move: function( toField ){
			var coordinates    = toField.coordinates( this.color ),
				enPassantPiece = null;
			
			   coordinates.y === this.y + 1 
			&& toField.piece === null
			&& ( enPassantPiece = this.board[ this.x ][ this.y + 1 ].piece );
				
			   coordinates.y === this.y - 1 
			&& toField.piece === null
			&& ( enPassantPiece = this.board[ this.x ][ this.y - 1 ].piece );
						
			if( enPassantPiece ){ 
				enPassantPiece.field.leave( enPassantPiece );
				enPassantPiece.board.removeFromPlay( enPassantPiece );
			}
			
			if( coordinates.y === 4 ){
				// We are moving two fields, this means we will have to check if we
				// are going to be attacked by a pawn from the opponent by en passant.
				//
				// This will be done by checking for the following conditions
				// 1. Is there a piece left/righ of us
				// 2. Is it an not my colour
				// 3. Is it a pawn
				// 
				// If these conditions are met we will add ourselfs to the en passant 
				// list of the opponent pawn. 
				
				   this.board[ coordinates.x - 1 ]
				&& this.board[ coordinates.x - 1 ][ coordinates.y ].piece
				&& this.board[ coordinates.x - 1 ][ coordinates.y ].piece.color !== this.color
				&& this.board[ coordinates.x - 1 ][ coordinates.y ].piece.type === "Pawn"
				&& this.board[ coordinates.x - 1 ][ coordinates.y ].enPassant.push( this );
				
				   this.board[ coordinates.x + 1 ]
				&& this.board[ coordinates.x + 1 ][ coordinates.y ].piece
				&& this.board[ coordinates.x + 1 ][ coordinates.y ].piece.color !== this.color
				&& this.board[ coordinates.x + 1 ][ coordinates.y ].piece.type === "Pawn"
				&& this.board[ coordinates.x + 1 ][ coordinates.y ].enPassant.push( this );

			}
			
			this.inherited( arguments );
		}
		
	});
	
	return pieces.Pawn;	
});