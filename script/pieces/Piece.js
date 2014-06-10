/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var Compose = require( "compose" );

module.exports = Compose(

    function( _piece_ ){
		this.color = _piece_.color;
		
		"name" in _piece_ && ( this.name = _piece_.name );
		
		if( _piece_.board && _piece_.field ){
			this.place( _piece_.board, _piece_.field );				
			!this.name && ( this.name = this.field.name );
		}
	},

    {
		// Some information about the world around us
		inPlay: null,
		field:  null,
		board:  null,		
		
		color: null,
		name:  null,
		type:  "Abstract",
		
		// The X and Y here are relative to the starting side of the piece. For white line 0 would be
		// line 1 on the actuall board, for a black piece line 0 would be line 8 on the real board.
		// This is done to keep it easy to describe the pieces and so they can all move in the same
		// direction no matter what color they are.
		x: null,
		y: null, 
				
		//
		// Move, attack and cover methods. Use these to check what our own possabilities are.
		//
		lines: function( restrictions ){

			var x = this.x,
				y = this.y;
		
			return restrictions.map( 
    			    function( restriction ){	
    					
    					var line         = [ ],
    						xRestriction = restriction[ 0 ],
    						yRestriction = restriction[ 1 ];
    										
    					if( xRestriction === Infinity ){
    					
    						if( yRestriction === Infinity ){
    							
    								   ( x + 1 <= 7 && y + 1 <= 7 ) && line.push( [ x + 1, y + 1 ] )
    								&& ( x + 2 <= 7 && y + 2 <= 7 ) && line.push( [ x + 2, y + 2 ] )
    								&& ( x + 3 <= 7 && y + 3 <= 7 ) && line.push( [ x + 3, y + 3 ] )
    								&& ( x + 4 <= 7 && y + 4 <= 7 ) && line.push( [ x + 4, y + 4 ] )
    								&& ( x + 5 <= 7 && y + 5 <= 7 ) && line.push( [ x + 5, y + 5 ] )
    								&& ( x + 6 <= 7 && y + 6 <= 7 ) && line.push( [ x + 6, y + 6 ] )
    								&& ( x + 7 <= 7 && y + 7 <= 7 ) && line.push( [ x + 7, y + 7 ] );
    						
    						} else if( yRestriction === -Infinity ){
    							
    								   ( x + 1 <= 7 && y - 1 >= 0 ) && line.push( [ x + 1, y - 1 ] )
    								&& ( x + 2 <= 7 && y - 2 >= 0 ) && line.push( [ x + 2, y - 2 ] )
    								&& ( x + 3 <= 7 && y - 3 >= 0 ) && line.push( [ x + 3, y - 3 ] )
    								&& ( x + 4 <= 7 && y - 4 >= 0 ) && line.push( [ x + 4, y - 4 ] )
    								&& ( x + 5 <= 7 && y - 5 >= 0 ) && line.push( [ x + 5, y - 5 ] )
    								&& ( x + 6 <= 7 && y - 6 >= 0 ) && line.push( [ x + 6, y - 6 ] )
    								&& ( x + 7 <= 7 && y - 7 >= 0 ) && line.push( [ x + 7, y - 7 ] );
    		
    						} else {
    
    								   ( x + 1 <= 7 ) && line.push( [ x + 1, yRestriction ] )
    								&& ( x + 2 <= 7 ) && line.push( [ x + 2, yRestriction ] )
    								&& ( x + 3 <= 7 ) && line.push( [ x + 3, yRestriction ] )
    								&& ( x + 4 <= 7 ) && line.push( [ x + 4, yRestriction ] )
    								&& ( x + 5 <= 7 ) && line.push( [ x + 5, yRestriction ] )
    								&& ( x + 6 <= 7 ) && line.push( [ x + 6, yRestriction ] )
    								&& ( x + 7 <= 7 ) && line.push( [ x + 7, yRestriction ] );
    							
    						}
    						
    					} else if( xRestriction === -Infinity ){
    						
    						if( yRestriction === Infinity ){
    							
    								   ( x - 1 >= 0 && y + 1 <= 7 ) && line.push( [ x - 1, y + 1 ] )
    								&& ( x - 2 >= 0 && y + 2 <= 7 ) && line.push( [ x - 2, y + 2 ] )
    								&& ( x - 3 >= 0 && y + 3 <= 7 ) && line.push( [ x - 3, y + 3 ] )
    								&& ( x - 4 >= 0 && y + 4 <= 7 ) && line.push( [ x - 4, y + 4 ] )
    								&& ( x - 5 >= 0 && y + 5 <= 7 ) && line.push( [ x - 5, y + 5 ] )
    								&& ( x - 6 >= 0 && y + 6 <= 7 ) && line.push( [ x - 6, y + 6 ] )
    								&& ( x - 7 >= 0 && y + 7 <= 7 ) && line.push( [ x - 7, y + 7 ] );
    						
    						} else if( yRestriction === -Infinity ){
    							
    								   ( x - 1 >= 0 && y - 1 >= 0 ) && line.push( [ x - 1, y - 1 ] )
    								&& ( x - 2 >= 0 && y - 2 >= 0 ) && line.push( [ x - 2, y - 2 ] )
    								&& ( x - 3 >= 0 && y - 3 >= 0 ) && line.push( [ x - 3, y - 3 ] )
    								&& ( x - 4 >= 0 && y - 4 >= 0 ) && line.push( [ x - 4, y - 4 ] )
    								&& ( x - 5 >= 0 && y - 5 >= 0 ) && line.push( [ x - 5, y - 5 ] )
    								&& ( x - 6 >= 0 && y - 6 >= 0 ) && line.push( [ x - 6, y - 6 ] )
    								&& ( x - 7 >= 0 && y - 7 >= 0 ) && line.push( [ x - 7, y - 7 ] );
    		
    						} else {
    
    								   ( x - 1 >= 0 ) && line.push( [ x - 1, yRestriction ] )
    								&& ( x - 2 >= 0 ) && line.push( [ x - 2, yRestriction ] )
    								&& ( x - 3 >= 0 ) && line.push( [ x - 3, yRestriction ] )
    								&& ( x - 4 >= 0 ) && line.push( [ x - 4, yRestriction ] )
    								&& ( x - 5 >= 0 ) && line.push( [ x - 5, yRestriction ] )
    								&& ( x - 6 >= 0 ) && line.push( [ x - 6, yRestriction ] )
    								&& ( x - 7 >= 0 ) && line.push( [ x - 7, yRestriction ] );
    							
    						}
    						
    					} else if( xRestriction >= 0 && xRestriction <= 7 ){
    						
    						if( yRestriction === Infinity ){
    								   	
    								   ( y + 1 <= 7 ) && line.push( [ xRestriction, y + 1 ] )
    								&& ( y + 2 <= 7 ) && line.push( [ xRestriction, y + 2 ] )
    								&& ( y + 3 <= 7 ) && line.push( [ xRestriction, y + 3 ] )
    								&& ( y + 4 <= 7 ) && line.push( [ xRestriction, y + 4 ] )
    								&& ( y + 5 <= 7 ) && line.push( [ xRestriction, y + 5 ] )
    								&& ( y + 6 <= 7 ) && line.push( [ xRestriction, y + 6 ] )
    								&& ( y + 7 <= 7 ) && line.push( [ xRestriction, y + 7 ] );
    						
    						} else if( yRestriction === -Infinity ){
    							
    								   ( y - 1 >= 0 ) && line.push( [ xRestriction, y - 1 ] )
    								&& ( y - 2 >= 0 ) && line.push( [ xRestriction, y - 2 ] )
    								&& ( y - 3 >= 0 ) && line.push( [ xRestriction, y - 3 ] )
    								&& ( y - 4 >= 0 ) && line.push( [ xRestriction, y - 4 ] )
    								&& ( y - 5 >= 0 ) && line.push( [ xRestriction, y - 5 ] )
    								&& ( y - 6 >= 0 ) && line.push( [ xRestriction, y - 6 ] )
    								&& ( y - 7 >= 0 ) && line.push( [ xRestriction, y - 7 ] );
    		
    						} else {
    
    							   yRestriction >= 0
    							&& yRestriction <= 7
    							&& line.push( [ xRestriction, yRestriction ] );
    
    						}						
    					}
    				
    					return line;
    				}
				    , this
				)
				.map(
				    function( coordinateLine ){
										
    					/**
    					//
    					// After messing around with the profiler for a bit of fun it seems
    					// this is a bit faster. Probably because it doesn't have to make the 
    					// function call to the callback in the map every time and there are 
    					// basically no checks. The commented code does exactly the same.
    					//					
    					var board       = this.board[ this.color ],
    						currentLine = null,
    						lineLength  = coordinateLine.length,
    						result      = new Array( lineLength );
    					
    					while( currentLine = coordinateLine[ --lineLength ] ){
    						
    						result[ lineLength ] = board[ currentLine[ 0 ] ][ currentLine[ 1 ] ];
    						
    					}
    					
    					return result;
    					**/					
    					
    					var board = this.board[ this.color ]
    					
    					return coordinateLine.map( function( coordinate ){	
    						return board[ coordinate[ 0 ] ][ coordinate[ 1 ] ];
    					});
					
				    }
				    , this
                );
			
		},
		
		fields: function( restrictions ){						
			return this
			    .lines( restrictions )
				.map( 
					function( line ){
					
						var fields = [ ];
						
						   line[ 0 ] &&                     fields.push( line[ 0 ] )
						&& line[ 1 ] && !line[ 0 ].piece && fields.push( line[ 1 ] )
						&& line[ 2 ] && !line[ 1 ].piece && fields.push( line[ 2 ] )
						&& line[ 3 ] && !line[ 2 ].piece && fields.push( line[ 3 ] )
						&& line[ 4 ] && !line[ 3 ].piece && fields.push( line[ 4 ] )
						&& line[ 5 ] && !line[ 4 ].piece && fields.push( line[ 5 ] )
						&& line[ 6 ] && !line[ 5 ].piece && fields.push( line[ 6 ] )
						&& line[ 7 ] && !line[ 6 ].piece && fields.push( line[ 7 ] );
						
						return fields;
						
					}
					, this
				);
		},
				
		movement: function( restrictions ){
			return this
			    .fields( restrictions || [ ] )
				.reduce( 
    				function( flat, line ){
    					
    					flat.push.apply( flat, line );
    					return flat;
    					
    				}
    				, [ ]
                );			
		},		
		
		looks: function( ){ 
			return this.movement( ).filter( function( field ){ return field.piece === null; } ); 
		},
		
		attacks: function( ){ 
			var color = this.color;
			return this.movement( ).filter( function( field ){ return field.piece && field.piece.color !== color; } );
		},
		
		covers: function( ){ 
			var color = this.color;
			return this.movement( ).filter( function( field ){ return field.piece && field.piece.color === color; } );	
		},
		
		moves: function( ){
			var color = this.color;	
			//return this.movement( ).filter( function( field ){ return field.piece === null || field.piece.color !== color; } );	
			return this.movement( ).filter( function( field ){ 
				//return field.piece === null || field.piece.color !== color; 
				
				if( field.piece === null ){

					return true;
					
				} else if( field.piece.color !== color ){
					
					return true; 
					 
				} else {
					
					return false;
				
				}
				
			});	
		},
		
		//
		// What pieces are interacting with us?
		//
		relations: function( ){ return this.field.looking; },
				
		attackedBy: function( ){ 
			var color = this.color;
			return this.relations( ).filter( function( piece ){ return piece.color !== color; } );
		},
		
		coverdBy: function( ){ 
			var color = this.color;
			return this.relations( ).filter( function( piece ){ return piece.color === color; } );	
		},		
		
		//
		// Actions involving the piece
		//
		move: function( toField ){
			// Is it a legal field to move to?
			if( this.movement( ).indexOf( toField ) !== -1 ){
				
				var previousField = this.field;
				
				// Hitting other pawns en passant is only a valid move for the move
				// direcly after the oppertunity arrises. On all the next turns 
				// we need to make sure we can't.
				this.board[ this.color + "PiecesInPlay" ].forEach( function( piece ){
					piece.type === "Pawn" && ( piece.enPassant = null );					
				});
				
				// Now we we will leave our current field, update it and then update
				// ourselfs with the coordinates. Use the field.occupy and field.leave
				// methods because events could be bound to it.
				this.field.leave( this );
				
				this.field = toField;
				
				var coordinates = this.field.coordinates( this.color );
				this.x = coordinates.x;
				this.y = coordinates.y;				
				
				var undo = toField.occupy( this, previousField );
										
				if( this.board.isCheck( this.color ) ){
				
					console.warn( 
						"Invalid move causing or unresolving check ::\n\t", 
						{
							piece: this,
							field: toField
						}, 
						"\n" + this.board.toString( ) 
					);
					
					undo( );
					
					return false;
				
				} else {
												
					return true;
					
				}
				
			} else {
				
				console.warn( "Invalid move to field ::", {
					piece: this,
					field: toField
				});
				
				return false;
			}
		},
		
		place: function( board, field ){
			
			this.inPlay = true;
			this.field  = field;
			this.board  = board;
			
			var coordinates = this.field.coordinates( this.color );
			this.x = coordinates.x;
			this.y = coordinates.y;
			
			// We have been placed on a board so we are in play, set all the properties and do the
			// basic administration.			
			board.place( field, this );
		},	
		
		removeFromPlay: function( ){
			this.inPlay = false;
			this.field  = null;
			
			this.x = null;
			this.y = null;			
		},
				
		//
		// Administrative functions
		//
		clone: function( ){
			return new this.constructor({ 
				color: this.color,
				name:  this.name	
			});	
		},
		
		toString: function( ){
			return "["
				+ this.color + " "
				+ this.type + "(" + this.name + ") "
				+ ( ( this.field && this.field.name ) || "out of play" )
				+ "]";
		}
	}

);