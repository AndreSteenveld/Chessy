define([ "..", ".", "lib" ], function( chess, pieces, lib ){

	pieces.Piece = lib.declare( [ ], {
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
		
		constructor: function( _piece_ ){
			this.color = _piece_.color;
			
			"name" in _piece_ && ( this.name = _piece_.name );
			
			if( _piece_.board && _piece_.field ){
				this.place( _piece_.board, _piece_.field );				
				!this.name && ( this.name = this.field.name );
			}
		},
		
		//
		// Move, attack and cover methods. Use these to check what our own possabilities are.
		//
		lines: function( restrictions ){

			var x = this.x,
				y = this.y;
		
			return restrictions.map( Function.bind( this, function( restriction ){	
					
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
				}))
				.map( Function.bind( this, function( coordinateLine ){
							
					var board = this.board[ this.color ];
					
					return coordinateLine.map( function( coordinate ){	
						return board[ coordinate[ 0 ] ][ coordinate[ 1 ] ];
					});
					
				}));
			
		},
		
		fields: function( restrictions ){						
			return this.lines( restrictions )
				.map( 
					Function.bind( this, function( line ){
					
						var fields = [ ];
						
						   line[ 0 ] &&                     fields.push( line[ 0 ] )
						&& line[ 1 ] && !line[ 0 ].piece && fields.push( line[ 1 ] )
						&& line[ 2 ] && !line[ 1 ].piece && fields.push( line[ 2 ] )
						&& line[ 3 ] && !line[ 2 ].piece && fields.push( line[ 3 ] )
						&& line[ 4 ] && !line[ 3 ].piece && fields.push( line[ 4 ] )
						&& line[ 5 ] && !line[ 4 ].piece && fields.push( line[ 5 ] )
						&& line[ 6 ] && !line[ 5 ].piece && fields.push( line[ 6 ] );
						
						return fields;
						
					})
				);
		},
				
		movement: function( restrictions ){
			return this.fields( restrictions || [ ] )
				.reduce( function( flat, line ){
					
					flat.push.apply( flat, line );
					return flat;
					
				}, [ ]);			
		},		
				
		moves: function( ){ 
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
			var possibleFields = this.movement( );
					
			var isLegal = possibleFields.indexOf( toField ) !== -1;
						
			if( isLegal ){
				this.field.leave( this );
				
				toField.occupy( this );
				
				this.field = toField;
				
				var coordinates = this.field.coordinates( this.color );
				this.x = coordinates.x;
				this.y = coordinates.y;
			} else {
				console.warn( "Invalid move to field ::", {
					piece: this,
					field: toField
				});
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
	});
	
	return pieces.Piece;	
});