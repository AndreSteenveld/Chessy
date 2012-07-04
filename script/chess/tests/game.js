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
				
			var wPlayerAdded = new doh.Deferred( ),
				bPlayerAdded = new doh.Deferred( ),
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
					
			var result = new doh.Deferred( );
					
			game.on( "Start", function( _start_ ){
				
				"color" in _start_ && _start_.color === "white"
					? result.resolve( true )
					: result.reject( "The starting color was not white" );
				
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
					
			var result = new doh.Deferred( );
			
			game.on( "Start", function( _start_ ){
				
				"color" in _start_ && _start_.color === "black"
					? result.resolve( true )
					: result.reject( "The starting color was not black" );
				
			});
			
			game.start( );
			
			return result;			
		},
		
		making_a_move: function( ){
			
			var board   = setup_board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "black" }),
				game    = new chess.Game({ board: board });
			
			var result = new doh.Deferred( );
			
			var piece = board.fields.d2.piece,
				from  = board.fields.d2,
				to    = board.fields.d3;
			
			// We have to setup the handlers before we join the game. The normal and sane way
			// to do this would be to create a class and implement the methods.
			lib.aspect.after( wPlayer, "turn", piece.move.bind( piece, to ) );
			
			game.on( "Moved", function( _move_ ){ 
					
				// Check if the event object is more or less sane, if a false is supplied
				if( _move_.counter ){
					   _move_.occupant === null
					&& _move_.piece === piece
					&& _move_.from  === from
					&& _move_.to    === to
						? result.resolve( true )
						: result.reject( "The supplied event object in the after move event is not sane." );
				}
				
			});
			
			wPlayer.join( game, "white" );
			bPlayer.join( game, "black" );
			
			game.start( );
			
			return result;
			
		},
		
		making_an_illegal_move: function( ){
			
			var board   = setup_board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "black" }),
				game    = new chess.Game({ board: board });
			
			var result = new doh.Deferred( );
			
			var piece = board.fields.d2.piece,
				from  = board.fields.d2,
				to    = board.fields.d8;
			
			// We have to setup the handlers before we join the game. The normal and sane way
			// to do this would be to create a class and implement the methods.
			lib.aspect.after( wPlayer, "turn", piece.move.bind( piece, to ) );
			
			game.on( "Moved", function( _move_ ){
				
				_move_.counter && result.reject( "The move was successfull" );
				
			});
			
			game.on( "IllegalMove", function( exception ){
				
				//result.resolve( exception );
				result.resolve( true );
				
			});
						
			wPlayer.join( game, "white" );
			bPlayer.join( game, "black" );
			
			game.start( );
			
			return result;
		},
		
		play_a_few_moves: function( ){
			
			var board   = setup_board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "balck" }),
				game    = new chess.Game({ board: board });
			
			var moves = [
					new doh.Deferred( ), // white | D2 - D4
					new doh.Deferred( ), // black | D7 - D5
					new doh.Deferred( )  // white | D1 - D3
				];
				
			var result = new lib.DeferredList( moves, false, true, false );
			
			lib.aspect.after( wPlayer, "turn", function( _turn_ ){
				
				if( _turn_.counter === 0 ){
					
					board.fields.d2.piece.move( board.fields.d4 );
					
				} else if( _turn_.counter === 2 ){
					
					board.fields.d1.piece.move( board.fields.d3 );
					
				} else {
					
					result.reject( "The white player got an invalid turn" );
					
				}
				
			}, true );
			
			lib.aspect.after( bPlayer, "turn", function( _turn_ ){
				
				if( _turn_.counter === 1 ){
					
					board.fields.d7.piece.move( board.fields.d5 );
					
				} else if( _turn_.counter !== 3 ){
					
					result.reject( "The black player got an invalid tunr" );
					
				}
				
			}, true );
			
			game.on( "Moved", function( _move_ ){
				
				if( _move_.counter === 1 ){
					
					   _move_.from === board.fields.d2
					&& _move_.to   === board.fields.d4
						? moves[ 0 ].resolve( true )
						: moves[ 0 ].reject( "Move [white | D2 - D4] failed" );
						
				} else if( _move_.counter === 2 ){
					
					   _move_.from === board.fields.d7
					&& _move_.to   === board.fields.d5
						? moves[ 1 ].resolve( true )
						: moves[ 1 ].reject( "Move [black | D7 - D5] failed" );
						
				} else if( _move_.counter === 3 ){
					
					   _move_.from === board.fields.d1
					&& _move_.to   === board.fields.d3
						? moves[ 2 ].resolve( true )
						: moves[ 2 ].reject( "Move [white | D1 - D3] failed" );
						
				} else if( _move_.counter === 0 || _move_.counter === 4 ){
					
					// Do nothing, just making sure we are not going to throw an uneccesary`
					// error about the move counter. Also add an expression so lint won't
					// bother us.
					"Lint Y U not understand?!";
					
				} else {
					
					throw "Invalid move counter[ " + _move_.counter + " ]";
					
				}
			});
			
			wPlayer.join( game, "white" );
			bPlayer.join( game, "black" );
			
			game.start( );
			
			// Wrap the deferred list or else the runner will explode in a ball of fire
			// and sadness.
			var r = new doh.Deferred( );
			
			result.then(
				r.callback.bind( r ),
				r.errback.bind( r )
			);
			
			return r;			
		},
		
		check_event: function( ){ 
			
			var board   = new chess.board.Board( ),
				wPlayer = new chess.Player({ color: "white" }),
				bPlayer = new chess.Player({ color: "black" });
				
			var wKing  = new chess.pieces.King({  board: board, color: "white", field: board.fields.a1 }),
				//bQueen = new chess.pieces.Queen({ board: board, color: "black", field: board.fields.f2 });
				bQueen = new chess.pieces.Rook({ board: board, color: "black", field: board.fields.h2 });
				
			var game = new chess.Game({ 
					board: board,						
					color: "black" 
				});
			
			var gameCheck   = new doh.Deferred( ),
				playerCheck = new doh.Deferred( ),			
				result      = new lib.DeferredList([ gameCheck, playerCheck ], false, true, false ); // list, fire on one, fire on one err, consume err
			
			lib.aspect.after( wPlayer, "check", function( ){ 
								
				playerCheck.resolve( true );
				
				
			});
			
			lib.aspect.after( wPlayer, "turn", function( ){
				
				// if player check not resolved reject it!
				
			});
			
			lib.aspect.after( bPlayer, "turn", function( ){
				
				//bQueen.move( board.fields.f1 );
				bQueen.move( board.fields.h1 );
				
			});
			
			game.on( "Check", function( ){ 
				
				gameCheck.resolve( true );
				
			});
										
			wPlayer.join( game, "white" );
			bPlayer.join( game, "black" );
			
			game.start( );
			
			// For some reason the non-doh Deferreds don't play nice with testing, wrap the DeferredList
			// so that the test doesn't freeze.			
			var r = new doh.Deferred( );
			
			result.then( 
				r.callback.bind( r ), 
				r.errback.bind( r ) 
			);
			
			return r;			
		},
		
		mate_event: function (  ){
			doh.t( false, "Not implemented" );
		},
		
		surrender_event: function (  ){
			doh.t( false, "Not implemented" );
		},
		
		stale_event: function (  ){
			doh.t( false, "Not implemented" );
		}
		
	}
);

});