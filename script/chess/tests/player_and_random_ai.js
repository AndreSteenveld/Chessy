/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "chess", "lib", "doh" ], function( chess, lib, doh ){

function setup_board( ){
	
	var board = new chess.board.Board( );	
		
	// White pieces in starting position
	new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.a2 }); new chess.pieces.Rook({   color: "white", board: board, field: board.fields.a1 });
	new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.b2 }); new chess.pieces.Knight({ color: "white", board: board, field: board.fields.b1 });
	new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.c2 }); new chess.pieces.Bishop({ color: "white", board: board, field: board.fields.c1 });
	new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.d2 }); new chess.pieces.Queen({  color: "white", board: board, field: board.fields.d1 });
	new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.e2 }); new chess.pieces.King({   color: "white", board: board, field: board.fields.e1 });
	new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.f2 }); new chess.pieces.Bishop({ color: "white", board: board, field: board.fields.f1 });
	new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.g2 }); new chess.pieces.Knight({ color: "white", board: board, field: board.fields.g1 });
	new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.h2 }); new chess.pieces.Rook({   color: "white", board: board, field: board.fields.h1 });
	
	// Black pieces in stating position
	new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.a7 }); new chess.pieces.Rook({   color: "black", board: board, field: board.fields.a8 });
	new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.b7 }); new chess.pieces.Knight({ color: "black", board: board, field: board.fields.b8 });
	new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.c7 }); new chess.pieces.Bishop({ color: "black", board: board, field: board.fields.c8 });
	new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.d7 }); new chess.pieces.Queen({  color: "black", board: board, field: board.fields.d8 });
	new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.e7 }); new chess.pieces.King({   color: "black", board: board, field: board.fields.e8 });
	new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.f7 }); new chess.pieces.Bishop({ color: "black", board: board, field: board.fields.f8 });
	new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.g7 }); new chess.pieces.Knight({ color: "black", board: board, field: board.fields.g8 });
	new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.h7 }); new chess.pieces.Rook({   color: "black", board: board, field: board.fields.h8 });
	
	return board;
	
}

doh.register(

	"Player/Random-AI tests",
	
	{
		// Do we set the time out at 10s or more? 
		random_vs_random: function( ){
		
			var board = setup_board( );
			
			var game = new chess.Game({ board: board });
			
			var white = new chess.ai.Random({ color: "white", game: game }),
				black = new chess.ai.Random({ color: "black", game: game });
				
			var result = new doh.Deferred( );
				
			game.on( "End", function( result ){
				
				console.log( "Game result ::", result );
				result.resolve( true );
				
			});
		
			return result;
		}
	
	}
);
});