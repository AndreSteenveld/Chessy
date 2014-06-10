/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var Compose = require( "compose" ),
    Piece   = require( "./Piece" );
    
module.exports = Compose(

    function( _king_ ){ "castled" in _king_ && ( this.castled = _king_.castled ); },

    Piece,
    
    {
		type: "King",
		
		castled: false,
		
		movement: Compose.around( function( base ){
		    return function( ){
    			
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
    				&& 
    					[
    						board[ 2 ][ 0 ],
    						board[ 3 ][ 0 ]
    					]
    					.every( function( field ){
    						return !field.piece
    							&& field.looking.every( function( piece ){ return piece.color === color; } );					
    					})
    				&& fields.push( [ this.x - 2, this.y ] );
    				
    				   board[ 7 ][ 0 ].piece
    				&& board[ 7 ][ 0 ].piece.color === this.color
    				&& board[ 7 ][ 0 ].piece.type === "Rook"
    				&& 
    					[
    						board[ 5 ][ 0 ],
    						board[ 6 ][ 0 ]
    					]
    					.every( function( field ){
    						return !field.piece
    							&& field.looking.every( function( piece ){ return piece.color === color; } );					
    					})
    				&& fields.push( [ this.x + 2, this.y ] );
    				
    			}
    			
    			return base
    			    .call( this, fields )
    			    .filter( function( field ){
    					
    					return field.looking.every( function( watcher ){
    						
    						return watcher.color === color;
    						
    					});
    					
    				});
    			
    		};
        }),
		
		move: Compose.around( function( base ){
		    return function( toField ){
		
    			// Check if we can castle and if we want to castle, if so make sure we do some
    			// adminstration for the rook. Then move the king as it should and wire up the
    			// rook manually. When we are done the move has been successfull.
    			if(    this.castled === false 
    				&& this.field === this.board[ this.color ][ 4 ][ 0 ]
    				&& (
    					   toField === this.board[ this.color ][ 2 ][ 0 ]
    					|| toField === this.board[ this.color ][ 6 ][ 0 ]
    				)				
    			){
    				
    				var rook        = null,
    					rookToField = null;
    				
    				if( toField === this.board[ this.color ][ 2 ][ 0 ] ){
    					
    					rook        = this.board[ this.color ][ 0 ][ 0 ].piece;
    					rookToField = this.board[ this.color ][ 3 ][ 0 ];
    					
    				} else if( toField === this.board[ this.color ][ 6 ][ 0 ] ){
    					
    					rook        = this.board[ this.color ][ 7 ][ 0 ].piece;
    					rookToField = this.board[ this.color ][ 5 ][ 0 ];
    					
    				}
    				
    				// Now were done with the wiring move the king as intended.
    				base.apply( this, arguments );
    				
    				// Do the rook administration, we can't really call move( ... ) here because
    				// it is hooked? Maybe this should be refactored into more little functions.
    				rook.field.leave( rook );
    				
    				rookToField.occupy( rook );
    				
    				rook.field = rookToField;
    				
    				var coordinates = rook.field.coordinates( rook.color );
    				
    				rook.x = coordinates.x;
    				rook.y = coordinates.y;
    				
    				this.castled = true;
    				
    				return true;			
    			}
    			
    			return base.apply( this, arguments );
    		};
        })
	}
);