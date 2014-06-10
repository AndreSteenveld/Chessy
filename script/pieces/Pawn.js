/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var Compose = require( "compose" ),
    Piece   = require( "./Piece" );
    
module.exports = Compose(

    // The constructor in this case is quite special. We need to know the 
	// en passant pieces before the rest of initalization of the piece. 
	// Therefor we will need to execute this execute this constructor before
	// we do Piece#constructor
    function( _pawn_ ){ "enPassant" in _pawn_ && ( this.enPassant = _pawn_.enPassant ); },

    Piece,

    {
		type: "Pawn",
		
		enPassant: null,
		 
		movement: Compose.around( function( base ){
		    function( ){
			
    			var movement = [ ],
    				fields   = this.board[ this.color ];			
    			
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
    			if( this.enPassant ){
    				var coordinates = this.enPassant.coordinates( this.color );
    				movement.push( [ coordinates.x, coordinates.y + 1 ] );				
    			}
    			
    			return base.call( this, movement );			
    		};
        }),
		
		move: Compose.around( function( base ){ 
		    return function( toField ){
    			var coordinates    = toField.coordinates( this.color ),
    				enPassantPiece = null;
    						
    			   coordinates.y === this.y + 1 
    			&& toField.piece === null
    			&& ( enPassantPiece = this.board[ this.color ][ this.x ][ this.y + 1 ].piece );
    				
    			   coordinates.y === this.y - 1 
    			&& toField.piece === null
    			&& ( enPassantPiece = this.board[ this.color ][ this.x ][ this.y - 1 ].piece );
    						
    			if( enPassantPiece ){ 
    				enPassantPiece.field.leave( enPassantPiece );
    				enPassantPiece.board.removeFromPlay( enPassantPiece );
    			}
    			
    			// We will do the actual move first and then update our opponents, the en passant
    			// state is cleared in the Piece#move function.
    			if( !base.apply( this, arguments ) ){
    				// TODO: Rafactor this so that we can take care of the en passant situations aswell.
    				return false;				
    			}
    			
    			if( coordinates.y === 3 ){
    				//
    				// If we are moving to a field where is possible to get hit en passant we 
    				// will need to update our opponent. we update it with the field we are on.
    				//								
    				
    				if(    this.board[ this.color ][ coordinates.x - 1 ]
    					&& this.board[ this.color ][ coordinates.x - 1 ][ coordinates.y ].piece
    					&& this.board[ this.color ][ coordinates.x - 1 ][ coordinates.y ].piece.color !== this.color
    					&& this.board[ this.color ][ coordinates.x - 1 ][ coordinates.y ].piece.type === "Pawn"
    				){
    					this.board[ this.color ][ coordinates.x - 1 ][ coordinates.y ].piece.enPassant = toField;
    					toField.looking.push( this );
    				}
    				
    				if(    this.board[ this.color ][ coordinates.x + 1 ]
    					&& this.board[ this.color ][ coordinates.x + 1 ][ coordinates.y ].piece
    					&& this.board[ this.color ][ coordinates.x + 1 ][ coordinates.y ].piece.color !== this.color
    					&& this.board[ this.color ][ coordinates.x + 1 ][ coordinates.y ].piece.type === "Pawn"
    				){
    					this.board[ this.color ][ coordinates.x + 1 ][ coordinates.y ].piece.enPassant = toField;
    					toField.looking.push( this );
    				}
    			}
    			
    			return true;			
    		};
    	});
		
		attackedBy: Compose.around( function( base ){
		    return function( ){
    			var attackedBy  = base.apply( this, arguments ),
    				coordinates = null;	
    			
    			// Ok, figure out if we are being attacked by some en passant pawns next to us.
    			if( this.y === 3 ){
    				//
    				// If we are moving to a field where is possible to get hit en passant we 
    				// will need to update our opponent. we update it with the field we are on.
    				//								
    			
    				if(    this.board[ this.color ][ this.x - 1 ]
    					&& this.board[ this.color ][ this.x - 1 ][ this.y ].piece
    					&& this.board[ this.color ][ this.x - 1 ][ this.y ].piece.enPassant
    				){
    					coordinates = this.board[ this.color ][ this.x - 1 ][ this.y ].piece.enPassant.coordinates( this.color );
    					
    					   this.x === coordinates.x
    					&& this.y === coordinates.y
    					&& attackedBy.push( this.board[ this.color ][ this.x - 1 ][ this.y ].piece );
    				}
    			
    				if(    this.board[ this.color ][ this.x + 1 ]
    					&& this.board[ this.color ][ this.x + 1 ][ this.y ].piece
    					&& this.board[ this.color ][ this.x + 1 ][ this.y ].piece.enPassant
    				){
    					coordinates = this.board[ this.color ][ this.x + 1 ][ this.y ].piece.enPassant.coordinates( this.color );
    					
    					   this.x === coordinates.x
    					&& this.y === coordinates.y
    					&& attackedBy.push( this.board[ this.color ][ this.x + 1 ][ this.y ].piece );
    				}
    			}
    			
    			return attackedBy;			
    		}
    	})
		
	}

);     