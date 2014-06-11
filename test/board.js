/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
 var chess = require( "../chessy" );

module.exports = {
	
	"field orientation": function( test ){
	    
	    var board = new chess.board.Board({ });
		
		// Normal fields
		test.equal( board.fields[ 0 ][ 0 ], board.fields.a1, "South west is not A1" );
		test.equal( board.fields[ 0 ][ 7 ], board.fields.a8, "North west is not A8" );
		test.equal( board.fields[ 7 ][ 0 ], board.fields.h1, "South east is not H1" );
		test.equal( board.fields[ 7 ][ 7 ], board.fields.h8, "North east is not H8" );
		
		// Color specific boards
		test.equal( board.white[ 0 ][ 0 ], board.fields.a1, "White - South west is not A1" );
		test.equal( board.white[ 0 ][ 7 ], board.fields.a8, "White - North west is not A8" );
		test.equal( board.white[ 7 ][ 0 ], board.fields.h1, "White - South east is not H1" );
		test.equal( board.white[ 7 ][ 7 ], board.fields.h8, "White - North east is not H8" );
		
		test.equal( board.black[ 0 ][ 0 ], board.fields.h8, "Black - South west is not H8" );
		test.equal( board.black[ 0 ][ 7 ], board.fields.h1, "Black - North west is not H1" );
		test.equal( board.black[ 7 ][ 0 ], board.fields.a8, "Black - South east is not A8" );
		test.equal( board.black[ 7 ][ 7 ], board.fields.a1, "Black - North east is not A1" );
		
	    // test.done( );
	},

	"is check": function( test ){ 
	    
	    var board = new chess.board.Board({ });
	    
		new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });
		new chess.pieces.Rook({ color: "black", board: board, field: board.fields.h1 });
			
		test.ok( board.isCheck( "white" ) );	
		
		// test.done( );		
	},
	
	"is check mate": function( test ){ 
		
		var board = new chess.board.Board({ });
		
		new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });

		new chess.pieces.Rook({ color: "black", board: board, field: board.fields.c2 });
		new chess.pieces.Rook({ color: "black", board: board, field: board.fields.c1 });
		
		test.ok( board.isCheckMate( "white" ) );
		
		// test.done( );
	},
	
	"is stale mate": function( test ){ 
		
		var board = new chess.board.Board({ });
		
		new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.a8 });
			
		test.ok( board.isStaleMate( "white" ) );		
			
		// test.done( );
	},
	
	"is stale mate with boxed king": function( test ){
		
		var board = new chess.board.Board({ });
		
		new chess.pieces.King({ color: "white", board: board, field: board.fields.a8 });
		new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.a7 });
			
		new chess.pieces.Rook({ color: "black", board: board, field: board.fields.a1 });
		new chess.pieces.Rook({ color: "black", board: board, field: board.fields.b1 });
		
		test.ok( board.isStaleMate( "white" ) );		
		
		test.ok( !board.isCheck( "white" ) );
		test.ok( !board.isCheckMate( "white" ) );	
		
		// test.done( );
	},
	
	"check with static king": function( test ){
		
		var board = new chess.board.Board({ });
		
		new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });
		new chess.pieces.Rook({ color: "white", board: board, field: board.fields.d2 });
		
		new chess.pieces.Queen({ color: "black", board: board, field: board.fields.b2 });
		new chess.pieces.Bishop({ color: "black", board: board, field: board.fields.h8 });
		
		test.ok( board.isCheck( "white" ), "White is check" );
		test.ok( !board.isCheckMate( "white" ), "White is not mate because it can use the rook" );
		
		// test.done( );
	},
	
	"check mate with static king": function( test ){
		
		var board = new chess.board.Board({ });
		
		new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });
		new chess.pieces.Rook({ color: "white", board: board, field: board.fields.d2 });
		
		new chess.pieces.Queen({ color: "black", board: board, field: board.fields.b2 });
		new chess.pieces.Bishop({ color: "black", board: board, field: board.fields.h8 });
		new chess.pieces.Rook({ color: "black", board: board, field: board.fields.a8 });
		
		test.ok( board.isCheck( "white" ), "White is not only check it should be mate as well" );	
		test.ok( board.isCheckMate( "white" ), "White is mate, being attacked from multiple pieces over multiple lines" );
		
		// test.done( );
	}		
	
};