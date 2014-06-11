/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var chess = require( "../chessy" );

function isLooking( field ){ 
    
    return -1 !== field.looking.indexOf( this ); 
    
}

module.exports = {

    setUp: function( done ){
        this.board = new chess.board.Board({ });
        return done( );        
    }, 

    //
	// The basic moments
	//
	"pawn line of sight": function( test ){ 
		var pawn = new chess.pieces.Pawn({
			color: "white",
			board: this.board,
			field: this.board.fields.d2
		});
		
		test.ok(
			[ 
				board.fields.d4, 
				board.fields.d3 
			]
			.every( isLooking.bind( pawn ) )
		);
	},
	
	"pawn blocked line of sight": function( test ){
		var pawn = new chess.pieces.Pawn({
			color: "white",
			board: this.board,
			field: this.board.fields.d2
		});
		
		var rook = new chess.pieces.Rook({
			color: "white",
			board: this.board,
			field: this.board.fields.d3
		});
		
		test.ok( !pawn.moves( ).length );			
		
	},
	
	"pawn enpassant": function( test ){
		var bPawn = new chess.pieces.Pawn({
			color: "black",
			board: this.board,
			field: this.board.fields.a5
		});
		
		var wPawn = new chess.pieces.Pawn({
			color: "white",
			board: this.board,
			field: this.board.fields.b5,
			
			enPassant: this.board.fields.a5
		});
		
		test.notEqual( bPawn.attackedBy( ).indexOf( wPawn ),           -1, "Black pawn is not being attacked by white pawn." );
		test.notEqual( wPawn.moves( ).indexOf( this.board.fields.a6 ), -1, "White pawn can't move to A6." );			
	},
	
	"knight line of sight": function( test ){
		var knight = new chess.pieces.Knight({
			color: "white",
			board: this.board,
			field: this.board.fields.d4
		});
		
		test.ok(
			[ 
				board.fields.c2, this.board.fields.e2, 
				board.fields.b3, this.board.fields.f3, 
				board.fields.b5, this.board.fields.f5, 
				board.fields.c6, this.board.fields.e6
			]
			.every( isLooking.bind( knight ) )
		);
	},
	
	"bishop line of sight": function( test ){
		var bishop = new chess.pieces.Bishop({
			color: "white",
			board: this.board,
			field: this.board.fields.d4
		});
		
		test.ok(
			[
				/* north east */ this.board.fields.e5, this.board.fields.f6, this.board.fields.g7, this.board.fields.h8,
				/* north west */ this.board.fields.c5, this.board.fields.b6, this.board.fields.a7,
				/* south east */ this.board.fields.e3, this.board.fields.f2, this.board.fields.g1,
				/* south west */ this.board.fields.c3, this.board.fields.b2, this.board.fields.a1
			]
			.every( isLooking.bind( bishop ) )
		);
		
	},

	"rook line of sight": function( test ){
		var rook = new chess.pieces.Rook({
			color: "white",
			board: this.board,
			field: this.board.fields.d4
		});
		
		
		test.ok(
			[
				/* north */ this.board.fields.d5, this.board.fields.d6, this.board.fields.d7, this.board.fields.d8,
				/* south */ this.board.fields.d3, this.board.fields.d2, this.board.fields.d1,
				/* east  */ this.board.fields.e4, this.board.fields.f4, this.board.fields.g4, this.board.fields.h4,
				/* west  */ this.board.fields.c4, this.board.fields.b4, this.board.fields.a4
			]
			.every( isLooking.bind( rook ) )
		);
	},
	
	"queen line of sight": function( test ){
		var queen = new chess.pieces.Queen({
			color: "white",
			board: this.board,
			field: this.board.fields.d4
		});
		
		test.ok(
			[
				/* north */ this.board.fields.d5, this.board.fields.d6, this.board.fields.d7, this.board.fields.d8,
				/* south */ this.board.fields.d3, this.board.fields.d2, this.board.fields.d1,
				/* east  */ this.board.fields.e4, this.board.fields.f4, this.board.fields.g4, this.board.fields.h4,
				/* west  */ this.board.fields.c4, this.board.fields.b4, this.board.fields.a4,
				
				/* north east */ this.board.fields.e5, this.board.fields.f6, this.board.fields.g7, this.board.fields.h8,
				/* north west */ this.board.fields.c5, this.board.fields.b6, this.board.fields.a7,
				/* south east */ this.board.fields.e3, this.board.fields.f2, this.board.fields.g1,
				/* south west */ this.board.fields.c3, this.board.fields.b2, this.board.fields.a1
			]
			.every( isLooking.bind( queen ) )
		);
	},
	
	"king line of sight": function( test ){
		var king = new chess.pieces.King({
			color: "white",
			board: this.board,
			field: this.board.fields.d4
		});
		
		test.ok(
			[
				/* north */ this.board.fields.d5,
				/* south */ this.board.fields.d3,
				/* east  */ this.board.fields.e4,
				/* west  */ this.board.fields.c4,
				
				/* north east */ this.board.fields.e5, 
				/* north west */ this.board.fields.c5, 
				/* south east */ this.board.fields.e4, 
				/* south west */ this.board.fields.c3			
			]
			.every( isLooking.bind( king ) )
		);
		
	},
			
	// King special move and restrictions
	"king not checking": function( test ){ 
		var king = new chess.pieces.King({
			color: "white",
			board: this.board,
			field: this.board.fields.d4				
		});	
		
		new chess.pieces.Knight({
			color: "black",
			board: this.board,
			field: this.board.fields.f6
		});
		
		new chess.pieces.Knight({
			color: "black",
			board: this.board,
			field: this.board.fields.b2
		});
		
		var moves = king.moves( );
		
		test.ok(
			[
				/* north east */ this.board.fields.e5, 
				/* north west */ this.board.fields.c5, 
				/* south east */ this.board.fields.e3, 
				/* south west */ this.board.fields.c3
			]
			.every( function( field ){
				
				return -1 !== moves.indexOf( field );
				
			})
			, "King not moveable to safe field."
		);			
		
		test.ok(
			[
				/* north */ this.board.fields.d5,
				/* south */ this.board.fields.d3,
				/* east  */ this.board.fields.e4,
				/* west  */ this.board.fields.c4
			]
			.every( function( field ){
				
				return -1 === moves.indexOf( field );
				
			})
			, "King moveable to unsafe field."				
		);
		
	},
	
	"king castleing": function( test ){ 			
		var king = new chess.pieces.King({ 
			color: "white",
			board: this.board,
			field: this.board.fields.e1	
		});
		
		var moves = king.moves( );
		
		test.notEqual( moves.indexOf( this.board.fields.c1 ), -1, "Not possible to castle left because the rook is not on the board yet" );
		test.notEqual( moves.indexOf( this.board.fields.g1 ), -1, "Not possible to castle right because the rook is not on the board yet" );
		
		var lRook = new chess.pieces.Rook({ 
			color: "white",
			board: this.board,
			field: this.board.fields.a1
		});
		
		var rRook = new chess.pieces.Rook({ 
			color: "white",
			board: this.board,
			field: this.board.fields.h1	
		});
			
		moves = king.moves( );
		
		test.notEqual( moves.indexOf( this.board.fields.c1 ), -1, "King not able to castle left" );
		test.notEqual( moves.indexOf( this.board.fields.g1 ), -1, "King not able to castle right" );
	},
	
	"king not castleing because checked": function( test ){
		var king = new chess.pieces.King({ 
			color: "white",
			board: this.board,
			field: this.board.fields.e1	
		});
		
		var lRook = new chess.pieces.Rook({ 
			color: "white",
			board: this.board,
			field: this.board.fields.a1
		});
		
		var rRook = new chess.pieces.Rook({ 
			color: "white",
			board: this.board,
			field: this.board.fields.h1	
		});
		
		var queen = new chess.pieces.Queen({
			color: "black",
			board: this.board,
			field: this.board.fields.e3				
		});
			
		var moves = king.moves( );
		
		test.equal( moves.indexOf( this.board.fields.c1 ), -1 );
		test.equal( moves.indexOf( this.board.fields.g1 ), -1 );			
	},
	
	"king not castleing becuase looking apponent": function( test ){
		var king = new chess.pieces.King({ 
			color: "white",
			board: this.board,
			field: this.board.fields.e1	
		});
		
		var lRook = new chess.pieces.Rook({ 
			color: "white",
			board: this.board,
			field: this.board.fields.a1
		});
		
		var rRook = new chess.pieces.Rook({ 
			color: "white",
			board: this.board,
			field: this.board.fields.h1	
		});
		
		var queen = new chess.pieces.Bishop({
			color: "black",
			board: this.board,
			field: this.board.fields.e3				
		});
			
		var moves = king.moves( );
		
		test.equal( moves.indexOf( this.board.fields.c1 ), -1 );
		test.equal( moves.indexOf( this.board.fields.g1 ), -1 );			
	}
    
};