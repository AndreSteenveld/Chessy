/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([
	"..",        
    ".",
	"lib",   
	"./Field" /*jsl:import ./Field.js*/
	  
], function( chess, board, lib, Field ){
	
	board.Board = lib.declare( [ ], {
		// All the fields we have on the board, the pieces and other properties we need to know about
		// the board.
		fields:             null,
		fieldsByName:       null,
		fieldsByCoordinate: null,
		
		white: null,
		black: null,
				
		pieces:          null,		
		piecesInPlay:    null,
		piecesOutOfPlay: null,		
		
		whitePiecesInPlay: null,
		blackPiecesInPlay: null,
		
		// The names of the rows and columns.
		xNames: null,
		yNames: null,
		
		constructor: function( ){
			var board        = this,
				xNames       = this.xNames       = [ "a", "b", "c", "d", "e", "f", "g", "h" ],
				yNames       = this.yNames       = [ "1", "2", "3", "4", "5", "6", "7", "8" ],
				fieldsByName = this.fieldsByName = { };
			
			this.pieces = [ ];
			this.piecesInPlay = [ ];
			this.piecesOutOfPlay = [ ];
			this.whitePiecesInPlay = [ ];
			this.blackPiecesInPlay = [ ];
			
			var fieldsByCoordinate = this.fieldsByCoordinate = xNames.map( function( x, xCoordinate ){
				return yNames.map( function( y, yCoordinate ){
					var field = new Field({
						x: xCoordinate,
						y: yCoordinate,
						
						xName: x,
						yName: y,
						
						board: board
					});
					
					fieldsByName[ x + y ] = field;
					
					return field;
				});
			});
			
			this.fields = lib.delegate( fieldsByName, fieldsByCoordinate );
			
			this.white = lib.delegate( this.fields, { pieces: this.whitePiecesInPlay });

			// TODO: Rewrite this to a reduce that makes sense.						
			var blackBoard = lib.delegate( fieldsByName, fieldsByCoordinate
					.map( function( column ){ return [ ].concat( column ).reverse( ); })
					.reverse( )				
			);
						
			this.black = lib.delegate( blackBoard, { pieces: this.blackPiecesInPlay });
		},
		
		clone: function( ){
			var board = new chess.board.Board( );
			
			this.pieces.forEach( function( piece ){
				var clone = piece.clone( );
				
				if( piece.field ){
					board.place( board.field[ piece.field.name ], clone );
					
				} else {
					
					board.pieces.push( piece );
					board.piecesOutOfPlay.push( piece );
					
				}
			});
			
			return board;
		},
		
		isCheck: function( color ){ 
			return this[ color + "PiecesInPlay" ].some( function( piece ){
				
				return piece.type === "King"
					&& piece.moves( ).length
					&& piece.attackedBy( ).length;
				
			});								
		},
		
		isCheckMate: function( color ){ 
			return this[ color + "PiecesInPlay" ].some( function( piece ){
				
				return piece.type === "King"
					&& !piece.moves( ).length
					&& piece.attackedBy( ).length;
				
			});			
		},
		
		isStaleMate: function( color ){ 
			
			return !this[ color + "PiecesInPlay" ].some( function( piece ){
				
				return piece.moves( ).length;
				
			});
	
		},
		
		clear: function( ){
			// Clear the board!
		},
		
		place: function( field, piece ){ 
			this.pieces.push( piece );
			this.piecesInPlay.push( piece );
			this[ piece.color + "PiecesInPlay" ].push( piece );
				
			return field.occupy( piece ); 
		},		
		
		removeFromPlay: function( piece, completly ){
			var inPlayIndex = this.piecesInPlay.indexOf( piece ),
				colorIndex  = this[ piece.color + "PiecesInPlay" ].indexOf( piece );
			
			this.piecesInPlay.splice( inPlayIndex, 1 );
			this[ piece.color + "PiecesInPlay" ].splice( colorIndex, 1 );
			
			!completly && this.piecesOutOfPlay.push( piece );
			
			piece.removeFromPlay( );
		},
		
		replace: function( oldPiece, newPiece ){
			
			var field = oldPiece.field;
				
			this.removeFromPlay( oldPiece, true );
			
			newPiece.place( this, field );
			
		}
	});
	
	return board.Board;	
});