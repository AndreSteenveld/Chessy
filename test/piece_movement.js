/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var chess = require( "chessy" );

var Piece = lib.declare( [ chess.pieces.Piece ], {
	
	type: "Piece",
	
	movement: function( ){
		return this.inherited( arguments, [[
			
			[ this.x, this.y + 1 ]
			
		]]);		
	}
	
});

module.exports = {

    setUp: function( done ){
        this.board = new chess.board.Board({ });
        return done( );        
    }, 
        
    //
    // Piece movements
    //
    "move piece": function( test ){			
		var piece = new Piece({
			color: "white",
			board: this.board,
			field: this.board.fields.d4
		});
		
		test.equal( this.board.fields.d4.piece, piece, "Piece is not at the D4" );
		
		test.ok( piece.move( this.board.fields.d5 ), "The move was unsuccessfull" );
		
		test.notEqual( this.board.fields.d4.piece, piece, "Piece is still at D4" );
		test.equal(    this.board.fields.d5.piece, piece, "Piece is not at D5" );
	},
	
	"taking piece": function( test ){
		var white = new Piece({
			color: "white",
			board: this.board,
			field: this.board.fields.d4
		});
		
		var black = new Piece({
			color: "black",
			board: this.board,
			field: this.board.fields.d5
		});
		
		test.equal( this.board.piecesInPlay.length, 2, "There are [ " + this.board.piecesInPlay.length + " ] in play." );
		
		test.ok( white.move( this.board.fields.d5 ), "The move was not successfull" );
		
		test.notEqual( this.board.fields.d5.piece, black, "The piece is still the black piece" );
		test.equal(    this.board.fields.d5.piece, white, "It's not the white piece on D5" );
		
		test.equal( black.inPlay, false, "Black piece is still in play" );
		test.equal( black.field,  null,  "Black piece is still on a field" );
		
		test.equal( this.board.piecesInPlay.length,    1, "There are still [ " + this.board.piecesInPlay.length + " ] in play" );
		test.equal( this.board.piecesOutOfPlay.length, 1, "There are [ " + this.board.piecesOutOfPlay.length + " ] out of play" );
	},
	
	"illegal move": function( test ){
		var piece = new Piece({
			color: "white",
			board: this.board,
			field: this.board.fields.d4
		});
		
		test.ok( !piece.move( this.board.fields.d6 ), "It was possible to make an illegal move" );			
		
	},
	
	"pawn moveing into en passant": function( test ){
		
		var bPawn = new chess.pieces.Pawn({
			color: "black",
			board: this.board,
			field: this.board.fields.a7
		});
		
		var wPawn = new chess.pieces.Pawn({
			color: "white",
			board: this.board,
			field: this.board.fields.b5
		});
		
		test.ok( bPawn.move( this.board.fields.a5 ), "The move was unsuccessfull" );
		
		test.equal( bPawn.attackedBy( ).indexOf( wPawn ),           -1, "Black pawn is not being attacked by white pawn." );
		test.equal( wPawn.moves( ).indexOf( this.board.fields.a6 ), -1, "White pawn can't move to A6." );
		
	},
	
	"pawn looking at en passant but not moving": function( test ){
		
		var bPawn = new chess.pieces.Pawn({
			color: "black",
			board: this.board,
			field: this.board.fields.a7
		});
		
		var notEnPassant = new chess.pieces.Pawn({
			color: "black",
			board: this.board,
			field: this.board.fields.h7
		});
		
		var wPawn = new chess.pieces.Pawn({
			color: "white",
			board: this.board,
			field: this.board.fields.b5
		});
		
		// Ok we are going to look if we can move in to an en passant situation, I think
		// there is a little bug that assigns the moves before actually moving the pawn.
		bPawn.moves( );
		
		test.ok( notEnPassant.move( this.board.fields.h6 ), "The move of the non en passant pawn didn't move" );
		
		test.equal( bPawn.attackedBy( ).indexOf( wPawn ),    -1, "Black pawn is being attacked by white pawn." );
		test.equal( wPawn.moves( ).indexOf( this.board.fields.a6 ), -1, "White pawn can move to A6." );
			
	},
	
	"king castleing left": function( test ){
				
		var king = new chess.pieces.King({ 
			color: "white", 
			board: this.board,
			field: this.board.fields.e1
		});
		
		var rook = new chess.pieces.Rook({ 
			color: "white",
			board: this.board,
			field: this.board.fields.a1
		});

		test.ok( king.move( this.board.fields.c1 ), "Castleing move failed" );
		
		// Make sure the pieces have moved
		test.equal( this.board.fields.a1.piece, null, "The castle hasn't moved" );
		test.equal( this.board.fields.e1.piece, null, "The king hasn't moved" );
		
		// Make sure they are occupying the correct fields
		test.equal( this.board.fields.c1.piece, king, "The king is not occupying c1" );
		test.equal( this.board.fields.d1.piece, rook, "The rook is not occupying d1" );
		
		// Make sure the pieces know what field they are occupying
		test.equal( this.board.fields.c1, king.field, "King doesn't know what field he is occupying" );
		test.equal( this.board.fields.d1, rook.field, "Rook doesn't know what field he is occupying" );
		
	},
	
	"king castleing right": function( test ){
		
		var king = new chess.pieces.King({ 
			color: "white", 
			board: this.board,
			field: this.board.fields.e1
		});
		
		var rook = new chess.pieces.Rook({ 
			color: "white",
			board: this.board,
			field: this.board.fields.h1				
		});

		test.ok( king.move( this.board.fields.g1 ), "Castleing move failed" );
		
		// Make sure the pieces have moved
		test.equal( this.board.fields.h1.piece, null, "The castle hasn't moved" );
		test.equal( this.board.fields.e1.piece, null, "The king hasn't moved" );
					
		// Make sure they are occupying the correct fields
		test.equal( this.board.fields.g1.piece, king, "The king is not occupying g1" );
		test.equal( this.board.fields.f1.piece, rook, "The rook is not occupying f1" );
		
		// Make sure the pieces know what field they are occupying
		test.equal( this.board.fields.g1, king.field, "King doesn't know what field he is occupying" );
		test.equal( this.board.fields.f1, rook.field, "Rook doesn't know what field he is occupying" );
		
	},
	
	"king not castlering because it already did": function( test ){
		
		var king = new chess.pieces.King({
			color: "white",
			board: this.board,
			castled: true,
			field: this.board.fields.e1
		});
		
		new chess.pieces.Rook({
			color: "white",
			board: this.board,
			field: this.board.fields.a1
		});
		
		new chess.pieces.Rook({
			color: "white",
			board: this.board,
			field: this.board.fields.h8
		});
		
		var moves = king.moves( );
		
		test.equal( moves.indexOf( this.board.fields.c1 ), -1 );
		test.equal( moves.indexOf( this.board.fields.g1 ), -1 );
	},
	
	"king not moving to an attacked field": function( test ){
					
		var king = new chess.pieces.King({ 
			color: "white", 
			board: this.board,
			field: this.board.fields.a1
		});
		
		new chess.pieces.Rook({ 
			color: "black",
			board: this.board,
			field: this.board.fields.b8				
		});
		
		test.ok( !king.move( this.board.fields.b1 ), "King moved to an attacked field" );
		
	},
	
	"king can't move": function( test ){
		
		var king = new chess.pieces.King({ 
			color: "white", 
			board: this.board,
			field: this.board.fields.a1
		});
		
		new chess.pieces.Rook({ 
			color: "black",
			board: this.board,
			field: this.board.fields.b8				
		});
		
		new chess.pieces.Rook({
			color: "black",
			board: this.board,
			field: this.board.fields.h2
		});
		
		test.ok( !king.move( this.board.fields.b1 ), "King moved to B1" );
		test.ok( !king.move( this.board.fields.a2 ), "King moved to A2" );
		test.ok( !king.move( this.board.fields.b2 ), "King moved to B2 ");
		
		test.equal( king.moves( ).length, 0, "The king has moves to make" );			
	},
	
	"moving a rook on an empty this.board": function( test ){
		
		var rook = new chess.pieces.Rook({ this.board: this.board, color: "white", field: this.board.fields.h8 });
		
		test.ok(
			rook.movement( ).every( function( field ){ 
				return field === this.board.fields.h7
					|| field === this.board.fields.h6
					|| field === this.board.fields.h5
					|| field === this.board.fields.h4
					|| field === this.board.fields.h3
					|| field === this.board.fields.h2
					|| field === this.board.fields.h1
					|| field === this.board.fields.a8
					|| field === this.board.fields.b8
					|| field === this.board.fields.c8
					|| field === this.board.fields.d8
					|| field === this.board.fields.e8
					|| field === this.board.fields.f8
					|| field === this.board.fields.g8;
			}),
			"The rook is not looking at all the fields current fields"
		);
			
		test.ok( rook.move( this.board.fields.h1 ), "Moving the rook failed" );
		
		test.ok(
			rook.movement( ).every( function( field ){ 
				return field === this.board.fields.h7
					|| field === this.board.fields.h6
					|| field === this.board.fields.h5
					|| field === this.board.fields.h4
					|| field === this.board.fields.h3
					|| field === this.board.fields.h2
					|| field === this.board.fields.h8
					|| field === this.board.fields.a1
					|| field === this.board.fields.b1
					|| field === this.board.fields.c1
					|| field === this.board.fields.d1
					|| field === this.board.fields.e1
					|| field === this.board.fields.f1
					|| field === this.board.fields.g1;
			}),
			"The rook is not looking at all the new fields"
		);			
		
	},
	
	"moving a rook to attack a pawn": function( test ){
		
		var rook = new chess.pieces.Rook({ board: this.board, color: "white", field: this.board.fields.h8 }),
			pawn = new chess.pieces.Pawn({ board: this.board, color: "black", field: this.board.fields.a1 });
		
		var isLooking = function( field ){ 
			var result = -1 !== field.looking.indexOf( this ); 
		
			!result && console.error( this.toString( ) + " is not lookint at :: ", field );
			
			return result;				
		};
		
		test.ok( 
			[
				board.fields.h7,
				board.fields.h6,
				board.fields.h5,
				board.fields.h4,
				board.fields.h3,
				board.fields.h2,
				board.fields.h1,
				board.fields.a8,
				board.fields.b8,
				board.fields.c8,
				board.fields.d8,
				board.fields.e8,
				board.fields.f8,
				board.fields.g8
			].every( isLooking.bind( rook ) ),
			"The rook is not looking at all the fields cuurent fields"
		);
		
		test.ok( rook.move( this.board.fields.h1 ), "Moving the rook failed" );
		
		//console.log( rook.movement( ).map( function( f ){ return f.toString( ); } ) );
		//console.log( this.board.toString( ) );
		
		test.ok(
			[
				board.fields.h7,
				board.fields.h6,
				board.fields.h5,
				board.fields.h4,
				board.fields.h3,
				board.fields.h2,
				board.fields.h8,
				board.fields.a1,
				board.fields.b1,
				board.fields.c1,
				board.fields.d1,
				board.fields.e1,
				board.fields.f1,
				board.fields.g1
			].every( isLooking.bind( null, rook ) ),
			"The rook is not looking at all the new fields"
		);
		
		test.ok(
			rook.movement( ).some( function( field ){ return field === this.board.fields.a1; } ),
			"The rook isn't looking at A1"			
		);
	
		test.ok(
			rook.attacks( ).some( function( field ){ return field === this.board.fields.a1; } ),
			"The rook isn't attacking A1" 
		);
	
		//console.log( this.board.toString( ) );
	
		test.equal( pawn.attackedBy( )[ 0 ], rook, "Pawn wasn't being attacked" );
	},
	
	"move must cancel check": function( test ){
		
		var king = new chess.pieces.King({ board: this.board, color: "white", field: this.board.fields.a1 }),
			pawn = new chess.pieces.Pawn({ board: this.board, color: "white", field: this.board.fields.e2 }),
			
			queen = new chess.pieces.Queen({ board: this.board, color: "black", field: this.board.fields.a8 });
			
		test.ok( this.board.isCheck( "white" ), "White should be check" );
		
		test.ok( !pawn.move( this.board.fields.e3 ), "Moving the pawn won't fix the check situation" );
					
		test.equal( this.board.fields.e2.piece, pawn, "The pawn has moved even though the move was illegal" );
		
		test.ok( this.board.isCheck( "white" ), "White should still be check after the failed move" );
		
	}
    
};
