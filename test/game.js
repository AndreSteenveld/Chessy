/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
 
var chess = require( "../chessy" ),
    RSVP  = require( "rsvp" );

module.exports = {       
    
    setUp: function( done ){
    
        var board = this.board = new chess.board.Board( );	
		
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
    	    
    	done( );        
    },
    
    "creating a game": function( test ){
		var board = this.board,
			game  = new chess.Game({ board: board });			
		
		test.ok( game instanceof chess.Game );
	},
			
	"adding players to a game": function( test ){
		var board   = this.board,
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" }),
			game    = new chess.Game({ board: board });
			
		var wPlayerAdded = RSVP.defer( "White player added" ),
			bPlayerAdded = RSVP.defer( "Black player added" ),
			playersAdded = RSVP.all([ wPlayerAdded.promise, bPlayerAdded.promise ]);
			
		game.on( "onPlayerJoin", function( playerJoined ){
			playerJoined.color === "white"
				? wPlayerAdded.resolve( true )
				: bPlayerAdded.resolve( true );
		});
		
		game.join( wPlayer, "white" );
		game.join( bPlayer, "black" );
		
		return playersAdded;
	},
	
	"intially starting a game": function( test ){
		var board   = this.board,
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" }),
			game    = new chess.Game({
					board: board,
					white: wPlayer,
					black: bPlayer					
				});
				
		var result = RSVP.defer( );
				
		game.on( "onStart", function( _start_ ){
			
			"color" in _start_ && _start_.color === "white"
				? result.resolve( true )
				: result.reject( "The starting color was not white" );
			
		});
		
		game.start( );
		
		return result.promise;
	},
	
	"starting the game with black on move": function( test ){
		var board   = this.board,
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" }),
			game    = new chess.Game({
					board: board,
					white: wPlayer,
					black: bPlayer,
					
					color: "black"
				});
				
		var result = RSVP.defer( );
		
		game.on( "Start", function( _start_ ){
			
			"color" in _start_ && _start_.color === "black"
				? result.resolve( true )
				: result.reject( "The starting color was not black" );
			
		});
		
		game.start( );
		
		return result.promise;			
	},
	
	"making a move": function( test ){
		
		var board   = this.board,
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" }),
			game    = new chess.Game({ board: board });
		
		var result = RSVP.defer( );
		
		var piece = board.fields.d2.piece,
			from  = board.fields.d2,
			to    = board.fields.d3;
		
		// We have to setup the handlers before we join the game. The normal and sane way
		// to do this would be to create a class and implement the methods.			
		wPlayer.on( "Turn", piece.move.bind( piece, to ) );
		
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
		
		return result.promise;
		
	},
	
	"making an illegal move": function( test ){
		
		var board   = this.board,
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" }),
			game    = new chess.Game({ board: board });
		
		var result = RSVP.defer( );
		
		var piece = board.fields.d2.piece,
			from  = board.fields.d2,
			to    = board.fields.d8;
		
		// We have to setup the handlers before we join the game. The normal and sane way
		// to do this would be to create a class and implement the methods.
		wPlayer.on( "Turn", piece.move.bind( piece, to ) );
		
		game.on( "Moved", function( _move_ ){
			
			_move_.counter && result.reject( "The move was successfull" );
			
		});
		
		game.on( "IllegalMove", function( exception ){
			
			result.resolve( true );
			
		});
					
		wPlayer.join( game, "white" );
		bPlayer.join( game, "black" );
		
		game.start( );
		
		return result.promise;
	},
	
	"play a few moves": function( test ){
		
		var board   = this.board,
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "balck" }),
			game    = new chess.Game({ board: board });
		
		var moves = [
				RSVP.defer( "white | D2 - D4" ), 
				RSVP.defer( "black | D7 - D5" ), 
				RSVP.defer( "white | D1 - D3" )  
			];
			
		var result = new RSVP.all( moves );
		
		wPlayer.on( "Turn", function( _turn_ ){
			
			if( _turn_.counter === 0 ){
				
				board.fields.d2.piece.move( board.fields.d4 );
				
			} else if( _turn_.counter === 2 ){
				
				board.fields.d1.piece.move( board.fields.d3 );
				
			} else {
				
				result.reject( "The white player got an invalid turn" );
				
			}
			
		}, true );
		
		bPlayer.on( "Turn", function( _turn_ ){
			
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
		
		return result.promise;
	},
	
	"check event": function( test ){ 
		
		var board   = new chess.board.Board( ),
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" });
			
		var wKing  = new chess.pieces.King({  board: board, color: "white", field: board.fields.a1 }),
			bQueen = new chess.pieces.Rook({ board: board, color: "black", field: board.fields.h8 });
			
		var game = new chess.Game({ 
				board: board,						
				color: "black" 
			});
		
		var gameCheck   = RSVP.defer( ),
			playerCheck = RSVP.defer( ),			
			turnCheck   = RSVP.defer( ),
			result      = RSVP.all([ gameCheck.promise, playerCheck.promise, turnCheck.promise ]);
		
		wPlayer.on(  "Check", function( ){ 
							
			playerCheck.resolve( true );
			
		});
		
		wPlayer.on( "Turn", function( ){
			
			// if player check not resolved reject it!
			playerCheck.then( 
				function( success ){ turnCheck.resolve( success ); },
				function( failure ){ turnCheck.reject( failure ); }
			);
			
		});
		
		bPlayer.on( "Turn", function( ){
			
			bQueen.move( board.fields.h1 );
			
		});
		
		game.on( "Check", function( ){ 
			
			gameCheck.resolve( true );
			
		});
									
		wPlayer.join( game, "white" );
		bPlayer.join( game, "black" );
		
		game.start( );
		
		return result.promise;
	},
	
	"mate event": function( test ){
		
		var board   = new chess.board.Board( ),
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" });
			
		var wKing = new chess.pieces.King({ board: board, color: "white", field: board.fields.a1 }),
			wPawns = [
				new chess.pieces.Pawn({ board: board, color: "white", field: board.fields.a2 }),
				new chess.pieces.Pawn({ board: board, color: "white", field: board.fields.b2 }),
				new chess.pieces.Pawn({ board: board, color: "white", field: board.fields.c2 })
			];
			
		var bQueen = new chess.pieces.Queen({ board: board, color: "black", field: board.fields.h8 });			
			
		var game = new chess.Game({ 
				board: board,						
				color: "black" 
			});
		
		var wMate = RSVP.defer( ),
			wLose = RSVP.defer( ),
			wEnd  = RSVP.defer( ),
			
			bWin = RSVP.defer( ),
			bEnd = RSVP.defer( ),
			
			gMate = RSVP.defer( ),
			gEnd  = RSVP.defer( ),
			
			result = RSVP.all([
				wMate.promise, wLose.promise, wEnd.promise,
				bWin.promise, bEnd.promise,
				gMate.promise, gEnd.promise
			]);
		
		//
		// Hacking in the events for the white player, makte sure we are going to check if he
		// recieves the mate event and then the end event.
		//
		wPlayer.on( "CheckMate", function( ){ wMate.resolve( true ); });
		
		wPlayer.on( "Lose", function( ){ wLose.resolve( true ); });
		
		wPlayer.on( "End", function( ){ wEnd.resolve( true ); });
					
		// Making sure they are made public on the Game object
		game.on( "CheckMate", function( ){ gMate.resolve( true ); });
		
		game.on( "End", function( ){ gEnd.resolve( true ); });
		
		// Wire up the black player to make the move and have a win event.
		bPlayer.on( "Turn", function( ){ bQueen.move( board.fields.h1 ); });
		
		bPlayer.on( "Win", function( ){ bWin.resolve( true ); });
		
		bPlayer.on( "End", function( ){ bEnd.resolve( true ); });
		
		wPlayer.join( game, "white" );
		bPlayer.join( game, "black" );
		
		game.start( );
		
		return result.promise;
		
	},
	
	"surrender event": function( test ){
		var board   = this.board,
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" });
			
		var game = new chess.Game({ board: board });
			
		var gameSurrender = RSVP.defer( ),
			gameEnd       = RSVP.defer( ),
			
			wEnd = RSVP.defer( ),
			wLose = RSVP.defer( ),
			
			bEnd = RSVP.defer( ),
			bWin = RSVP.defer( ),
			
			result = RSVP.all([
				gameSurrender.promise, gameEnd.promise,
				wEnd.promise, wLose.promise,
				bEnd.promise, bWin.promise
			]);
			
		game.on( "Surrender", function( ){ gameSurrender.resolve( true ); });
		game.on( "End", function( ){ gameEnd.resolve( true ); });
		
		wPlayer.on( "End", function( ){ wEnd.resolve( true ); });
		wPlayer.on( "Lose", function( ){ wLose.resolve( true ); });
		
		bPlayer.on( "End", function( ){ bEnd.resolve( true ); });
		bPlayer.on( "Win", function( ){ bWin.resolve( true ); });
		
		wPlayer.on( "Turn", function( ){ wPlayer.surrender( ); });		
		
		wPlayer.join( game, "white" );
		bPlayer.join( game, "black" );
		
		game.start( );
		
		return result.promise;
	},
	
	"stale event": function( test ){
		
		//
		// Note: When setting up the new colored event emitters this test passed when all the
		//       other tests based on movement failed. Check if this test actually does what
		//       it is suppose to do.
		//
		
		var board   = new chess.board.Board( ),
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" });
			
		var wKing = new chess.pieces.King({ board: board, color: "white", field: board.fields.a1 }),
			bRooks = [
				new chess.pieces.Rook({ board: board, color: "black", field: board.fields.h2 }),
				new chess.pieces.Rook({ board: board, color: "black", field: board.fields.b8 })
			];	
		
		var game = new chess.Game({ board: board });
		
		var gEnd = RSVP.defer( ),
			gStaleMate = RSVP.defer( ),
			gDraw = RSVP.defer( ),
			
			wEnd = RSVP.defer( ),
			wStaleMate = RSVP.defer( ),
			wDraw = RSVP.defer( ),
			
			bEnd = RSVP.defer( ),
			bStaleMate = RSVP.defer( ),
			bDraw = RSVP.defer( ),
			
			result = RSVP.all([
				gEnd.promise, gStaleMate.promise, gDraw.promise,
				wEnd.promise, wStaleMate.promise, wDraw.promise,
				bEnd.promise, bStaleMate.promise, bDraw.promise
			]);			
		
		game.on( "End", function( ){ gEnd.resolve( true ); });
		game.on( "StaleMate", function( ){ gStaleMate.resolve( true ); });
		game.on( "Draw", function( ){ gDraw.resolve( true ); });
		
		wPlayer.on( "End", function( ){ wEnd.resolve( true ); });
		bPlayer.on( "End", function( ){ bEnd.resolve( true ); });
		
		wPlayer.on( "StaleMate", function( ){ wStaleMate.resolve( true ); });
		bPlayer.on( "StaleMate", function( ){ bStaleMate.resolve( true ); });
		
		wPlayer.on( "Draw", function( ){ wDraw.resolve( true ); });
		bPlayer.on( "Draw", function( ){ bDraw.resolve( true ); });
					
		wPlayer.join( game, "white" );
		bPlayer.join( game, "black" );
		
		game.start( );
		
		return result.promise;
		
	},
	
	"white pawn promotion": function( test ){
		
		var board   = new chess.board.Board( ),
			wPlayer = new chess.Player({ color: "white" }),
			bPlayer = new chess.Player({ color: "black" });
			
		var pawn = new chess.pieces.Pawn({
				color: "white",
				board: board,
				field: board.fields.a7
			});
			
		var game = new chess.Game({ board: board });
		
		var moved    = RSVP.defer( ),
			promoted = RSVP.defer( ),
			result   = RSVP.all([ moved.promise, promoted.promise ]);
		
		wPlayer.on( "Turn", function( ){
			
			pawn.move( board.fields.a8 );
			
			moved.resolve( true );
			
		});
		
		wPlayer.on( "Promotion", function( _moved_ ){
			
			board.replace( _moved_.piece, new chess.pieces.Queen({ color: "white" }) );

			test.ok( board.fields.a8.piece.isInstanceOf( chess.pieces.Queen ), "The promoted pawn is not a instance of queen" );

			promoted.resolve( true );
			
		});			
			
		wPlayer.join( game, "white" );
		bPlayer.join( game, "black" );
			
		game.start( );
		
		return result.promise;
		
	}
	    
};

 

