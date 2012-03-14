define([ "../", "lib", "doh" ], function( chess, lib, doh ){

function wrap_tests( tests ){

	Object.keys( tests ).forEach( function( key ){
	
		lib.aspect.before( tests, key, function( ){
			return [ new chess.board.Board({ }), { } ];		
		});
		
	});
	
	return tests;
}

function isLooking( piece, field ){ return -1 !== field.looking.indexOf( piece ); }
	
doh.register( 
	// The name of our group
	"piece lines of sight", 
	
	wrap_tests({
		//
		// The basic moments
		//
		pawn_line_of_sight: function( board, pieces ){ 
			pieces.pawn = new chess.pieces.Pawn({
				color: "white",
				board: board,
				field: board.fields.d2
			});
			
			doh.assertTrue(
				[ 
					board.fields.d4, 
					board.fields.d3 
				]
				.every( isLooking.bind( null, pieces.pawn ) )
			);
		},
		
		knight_line_of_sight: function( board, pieces ){
			pieces.knight = new chess.pieces.Knight({
				color: "white",
				board: board,
				field: board.fields.d4
			});
			
			doh.assertTrue(
				[ 
					board.fields.c2, board.fields.e2, 
					board.fields.b3, board.fields.f3, 
					board.fields.b5, board.fields.f5, 
					board.fields.c6, board.fields.e6
				]
				.every( isLooking.bind( null, pieces.knight ) )
			);
		},
		
		bishop_line_of_sight: function( board, pieces ){
			pieces.bishop = new chess.pieces.Bishop({
				color: "white",
				board: board,
				field: board.fields.d4
			});
			
			doh.assertTrue(
				[
					/* north east */ board.fields.e5, board.fields.f6, board.fields.g7, board.fields.h8,
					/* north west */ board.fields.c5, board.fields.b6, board.fields.a7,
					/* south east */ board.fields.e3, board.fields.f2, board.fields.g1,
					/* south west */ board.fields.c3, board.fields.b2, board.fields.a1
				]
				.every( isLooking.bind( null, pieces.bishop ) )
			);
			
		},
	
		rook_line_of_sight: function( board, pieces ){
			pieces.rook = new chess.pieces.Rook({
				color: "white",
				board: board,
				field: board.fields.d4
			});
			
			
			doh.assertTrue(
				[
					/* north */ board.fields.d5, board.fields.d6, board.fields.d7, board.fields.d8,
					/* south */ board.fields.d3, board.fields.d2, board.fields.d1,
					/* east  */ board.fields.e4, board.fields.f4, board.fields.g4, board.fields.h4,
					/* west  */ board.fields.c4, board.fields.b4, board.fields.a4
				]
				.every( isLooking.bind( null, pieces.rook ) )
			);
		},
		
		queen_line_of_sight: function( board, pieces ){
			pieces.queen = new chess.pieces.Queen({
				color: "white",
				board: board,
				field: board.fields.d4
			});
			
			doh.assertTrue(
				[
					/* north */ board.fields.d5, board.fields.d6, board.fields.d7, board.fields.d8,
					/* south */ board.fields.d3, board.fields.d2, board.fields.d1,
					/* east  */ board.fields.e4, board.fields.f4, board.fields.g4, board.fields.h4,
					/* west  */ board.fields.c4, board.fields.b4, board.fields.a4,
					
					/* north east */ board.fields.e5, board.fields.f6, board.fields.g7, board.fields.h8,
					/* north west */ board.fields.c5, board.fields.b6, board.fields.a7,
					/* south east */ board.fields.e3, board.fields.f2, board.fields.g1,
					/* south west */ board.fields.c3, board.fields.b2, board.fields.a1
				]
				.every( isLooking.bind( null, pieces.queen ) )
			);
		},
		
		king_line_of_sight: function( board, pieces ){
			pieces.king = new chess.pieces.King({
				color: "white",
				board: board,
				field: board.fields.d4
			});
			
			doh.assertTrue(
				[
					/* north */ board.fields.d5,
					/* south */ board.fields.d3,
					/* east  */ board.fields.e4,
					/* west  */ board.fields.c4,
					
					/* north east */ board.fields.e5, 
					/* north west */ board.fields.c5, 
					/* south east */ board.fields.e4, 
					/* south west */ board.fields.c3			
				]
				.every( isLooking.bind( null, pieces.king ) )
			);
			
		},
				
		// King special move and restrictions
		king_not_checking: function( board, pieces ){ 
			pieces.king = new chess.pieces.King({
				color: "white",
				board: board,
				field: board.fields.d4				
			});	
			
			new chess.pieces.Knight({
				color: "black",
				board: board,
				field: board.fields.f6
			});
			
			new chess.pieces.Knight({
				color: "black",
				board: board,
				field: board.fields.b2
			});
			
			var moves = pieces.king.moves( );
			
			doh.assertTrue(
				[
					/* north east */ board.fields.e5, 
					/* north west */ board.fields.c5, 
					/* south east */ board.fields.e3, 
					/* south west */ board.fields.c3
				]
				.every( function( field ){
					
					return -1 !== moves.indexOf( field );
					
				})
				, "King not moveable to safe field."
			);			
			
			doh.assertTrue(
				[
					/* north */ board.fields.d5,
					/* south */ board.fields.d3,
					/* east  */ board.fields.e4,
					/* west  */ board.fields.c4,
				]
				.every( function( field ){
					
					return -1 === moves.indexOf( field );
					
				})
				, "King moveable to unsafe field."				
			);
			
		},
		
		king_castleing: function( ){ doh.t( 0 ); },
		king_not_castleing: function( ){ doh.t( 0 ); }
		
	})
	
);

});