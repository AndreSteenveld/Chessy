/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "../", "lib", "doh", "../Game", "../Player" ], function( chess, lib, doh ){

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

	"Game",
	
	{
		creating_a_game: function( ){
			var board = setup_board( ),
				game  = new chess.Game({ board: board });			
			
			doh.t( game.isInstanceOf( chess.Game ) );
		},
				
		adding_players_to_a_game: function( ){
			var board   = setup_board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "black" }),
				game    = new chess.Game({ board: board });
				
			var wPlayerAdded = new lib.Deferred( ),
				bPlayerAdded = new lib.Deferred( ),
				playersAdded = new lib.DeferredList([ wPlayerAdded, bPlayerAdded ]);
				
			game.on( "PlayerJoin", function( playerJoined ){
				playerJoined.color === "white"
					? wPlayerAdded.resolve( true )
					: bPlayerAdded.resolve( true );
			});
			
			game.join( wPlayer, "white" );
			game.join( bPlayer, "black" );
			
			return playersAdded;
		},
		
		intially_starting_a_game: function( ){
			var board   = setup_board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "black" }),
				game    = new chess.Game({
						board: board,
						white: wPlayer,
						black: bPlayer					
					});
					
			var result = new lib.Deferred( );
					
			game.on( "Start", function( _start_ ){
				
				"color" in _start_ && _start_.color === "white"
					? result.resolve( true )
					: result.reject( new doh._AssertFailure( "The starting color was not white" ) );
				
			});
			
			game.start( );
			
			return result;
		},
		
		starting_the_game_with_black_on_move: function( ){
			var board   = setup_board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "black" }),
				game    = new chess.Game({
						board: board,
						white: wPlayer,
						black: bPlayer,
						
						color: "black"
					});
					
			var result = new lib.Deferred( );
			
			game.on( "Start", function( _start_ ){
				
				"color" in _start_ && _start_.color === "black"
					? result.resolve( true )
					: result.reject( new doh._AssertFailure( "The starting color was not black" ) );
				
			});
			
			game.start( );
			
			return result;			
		},
		
		making_a_move: function( ){
			
			var board   = setup_board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "black" }),
				game    = new chess.Game({
						board: board,
						white: wPlayer,
						black: bPlayer					
					});
			
			var result = new lib.Deferred( );
			
			var piece = board.fields.d2.piece,
				from  = board.fields.d2,
				to    = board.fields.d3;
									
			lib.aspect.after( wPlayer, "turn", function( _turn_ ){
				
				
				
				
			}, true );
			
			lib.aspect.after( wPlayer, "moved", function( _moved_ ){
				
			}, true );
				
			
			
			game.start( );
			
			return result;
			
		},
		
		making_an_illegal_move: function( ){
			
			var board   = setup_board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "black" }),
				game    = new chess.Game({
						board: board,
						white: wPlayer,
						black: bPlayer					
					});
			
			var result = new lib.Deferred( );	
			
			game.start( );
			
			//lib.on( bPlayer, bPlayer.turn, function( ){ result.reject( "Move was illegal, black" ); } );
			//lib.on( wPlayer, wPlayer.turn, function( ){ result.reject( "Move was illegal, white" ); } );
			
			//board.fields.d7.piece.move( board.fields.d6 );
			
			result.reject( "Test not done implemented..." );
			
			return result;
		}
		
	}
);

});