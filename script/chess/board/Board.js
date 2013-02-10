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
					&& piece.attackedBy( ).length;
				
			});
										
		},
		
		isCheckMate: function( color ){ 
			
			return this[ color + "PiecesInPlay" ].some( function( piece ){
				
				if( piece.type === "King" ){
					
					var hasMoves  = !!piece.moves( ).length,
						attackers = piece.attackedBy( );
						
					return !hasMoves
						&& attackers.length
						&& ( attackers.length > 1 || attackers[ 0 ].attackedBy( ).length === 0 );
					
				} else {
					
					return false;	
					
				}

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
			var inPlayIndex    = this.piecesInPlay.indexOf( piece ),
				colorIndex     = this[ piece.color + "PiecesInPlay" ].indexOf( piece ),
				outOfPlayIndex      = completly && this.piecesOutOfPlay.indexOf( piece ),
				outOfPlayColorIndex = completly && this[ piece.color + "PiecesInPlay" ].indexOf( piece );
			
			inPlayIndex >= 0 && this.piecesInPlay.splice( inPlayIndex, 1 );
			colorIndex >= 0 && this[ piece.color + "PiecesInPlay" ].splice( colorIndex, 1 );
			
			!completly && this.piecesOutOfPlay.push( piece );
			
			completly && outOfPlayIndex >= 0      && this.piecesOutOfPlay.splice( outOfPlayIndex, 1 );
			completly && outOfPlayColorIndex >= 0 && this[ piece.color + "PiecesInPlay" ].splice( outOfPlayColorIndex, 1 );
			
			piece.removeFromPlay( );
		},
		
		replace: function( oldPiece, newPiece ){
			
			var field = oldPiece.field;
				
			this.removeFromPlay( oldPiece, true );
			
			newPiece.place( this, field );
			
		},
		
		toString: function( ){
			
			var BOARD_TEMPLATE = ""
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n 8 |${a8}|${b8}|${c8}|${d8}|${e8}|${f8}|${g8}|${h8}| "
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n 7 |${a7}|${b7}|${c7}|${d7}|${e7}|${f7}|${g7}|${h7}| "
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n 6 |${a6}|${b6}|${c6}|${d6}|${e6}|${f6}|${g6}|${h6}| "
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n 5 |${a5}|${b5}|${c5}|${d5}|${e5}|${f5}|${g5}|${h5}| "
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n 4 |${a4}|${b4}|${c4}|${d4}|${e4}|${f4}|${g4}|${h4}| "
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n 3 |${a3}|${b3}|${c3}|${d3}|${e3}|${f3}|${g3}|${h3}| "
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n 2 |${a2}|${b2}|${c2}|${d2}|${e2}|${f2}|${g2}|${h2}| "
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n 1 |${a1}|${b1}|${c1}|${d1}|${e1}|${f1}|${g1}|${h1}| "
				+ "\n   +-+-+-+-+-+-+-+-+ "
				+ "\n    A B C D E F G H  "
				+ "\n Capital letters are white "
				+ "\n";

			return lib.string.substitute( BOARD_TEMPLATE, this.fields, 
				function( field, key ){
					                     
					return !field.piece ? " "
						: field.piece.type === "Bishop" ? field.piece.color === "white" ? "B" : "b"
						: field.piece.type === "King"   ? field.piece.color === "white" ? "X" : "x"
						: field.piece.type === "Knight" ? field.piece.color === "white" ? "K" : "k"
						: field.piece.type === "Pawn"   ? field.piece.color === "white" ? "P" : "p"
						: field.piece.type === "Queen"  ? field.piece.color === "white" ? "Q" : "q"
						: field.piece.type === "Rook"   ? field.piece.color === "white" ? "R" : "r"
						: (null); // There is a piece but we are not sure what type
								
				}
			);
		}
	});
	
	return board.Board;	
});