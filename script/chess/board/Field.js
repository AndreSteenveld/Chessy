/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ ".", "lib" ], function( board, lib ){

	board.Field = lib.declare( [ ], {
		piece: null,		
		board: null,
		
		x: null,
		y: null,
		
		name:  null,
		xName: null,
		yName: null,
		
		looking: null,
		
		constructor: function( _field_ ){ 
			this.x = _field_.x;
			this.y = _field_.y;
			
			this.board = _field_.board;
			
			this.xName = _field_.xName;
			this.yName = _field_.yName;
			this.name = this.xName + this.yName;
			
			this.looking = [ ];	
		},
		
		leave: function( piece ){
			// Firstly we are going to check if we really are who we say we are.
			if( piece === this.piece ){
				
				// Now, because we are going to move we will update all the 
				// fields we are looking at. First we are going to remove
				// the piece and add it to the relevant fields when we occupy a
				// field again.
				piece.moves( ).forEach( function( field ){
					
					var index = field.looking.indexOf( piece );
					field.looking.splice( index, 1 );					
					
				});	
				
				// And were out of here...
				this.piece = null;
				
			}
		},
		
		occupy: function( piece ){
			this.piece && this.board.removeFromPlay( this.piece );
			this.piece = piece;
			
			this.piece.moves( ).forEach( function( field ){ field.looking.push( piece ); });
		},
		
		coordinates: function( color ){
			return !color || color === "white"
				? { x: this.x,     y: this.y     }
				: {	x: 7 - this.x, y: 7 - this.y };			
		},
		
		toString: function( ){
			return "[Field " + this.name + "]";			
		}
	});
	
	return board.Field;	
});