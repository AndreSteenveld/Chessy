/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define( [ ".", "lib" ], function( chess, lib ){

	chess.Player = lib.declare( [ ], {
		
		handles: null,
		
		game: null,
		
		color: null,
		board: null,
		
		constructor: function( _player_ ){ 
			"color" in _player_ && ( this.color = _player_.color );
			"game" in _player_ && this.join( _player_.game );		
		},
		
		//
		// Player methods
		// 
		join: function( game, color ){ 

			if( ( this.color = game.join( this, color || this.color ) ) ){
				
				this.game  = game;
				this.board = game.board;
				
				this.handles = {
					//
					// General game events
					//
					start: game.on( "Start", this.started.bind( this ) ),
					draw:  game.on( "Draw",  this.draw.bind( this ) ),
					
					end: game.on( "End", 
						Function.bind( this, function( _end_ ){
						
							// The game doesn't do all the triggering of events, its more a general thing
							// so if we want to fire win/lose events and then the more general end event 
							// we will have to do a little event routing of our own.
							if( _end_.result === "CheckMate" || _end_.result === "Surrender" ){
								
								_end_.winner === this.color
									? this.win.onIdle( this ).then( this.ended.bind( this, [ _end_ ] ) )
									: this.lose.onIdle( this ).then( this.ended.bind( this, [ _end_ ] ) );
									
							} else { // This is a stale mate, a draw or 3 board repetition
								
								this.ended.onIdle( this, [ _end_ ] );
								
							}
								
						})
					),
					
					//
					// Movement stuff
					//
					turn: game.onColor( this.color, "Turn", this.turn.bind( this ) ),
					//turn: game.on( this.color === "white" ? "WhiteTurn" : "BlackTurn", this.turn.bind( this ) ),
					
					placed: game.on( "Placed", this.placed.bind( this ) ),
					
					moved: game.on( "Moved", this.moved.bind( this ) ),
					
					promotion: game.onColor( this.color, "Promotion", this.promotion.bind( this ) ),
					//promotion: game.on( this.color === "white" ? "WhitePromotion" : "BlackPromotion", this.promotion.bind( this ) ),
					
					//
					// To the player
					//
					check: game.on( "Check", this.check.bind( this ) ),
					
					mated: game.on( "CheckMate", this.mate.bind( this ) ),
					
					staleMate: game.on( "StaleMate", this.staleMate.bind( this ) )			
					
				};		
				
			}		
			
		},
		
		leave: function( ){ 
			this.game = null;
			this.board = null;
			
			this.game.leave( this );			
		},
		
		offerDraw: function( ){ 
			var deferred = new lib.Deferred( )
				other = this.color === "white"
					? this.game.black
					: this.game.white;
					
			deferred.then(
				function( result ){
					
					result && this.end({ result: "draw" });
					
				}
			);
			
			this.game.once( "Moved", function( ){ deferred.resolve( false ); } );
			
			other.acceptDraw.onIdle( other, other.acceptDraw, [ deferred ] );
		},
		
		surrender: function( ){ 
			this.game.end({
				result: "Surrender",
				loser: this.color,
				winner: this.color === "white" ? "black" : "white"
			});
		},

		//
		// Handlers for general game events
		//
		started: function( ){ /* when the game has started */ },
		
		ended: function( ){ /* called when the game comes to an end */ },
		
		lose: function( ){ /* Called when the player loses */ },
		
		draw: function( ){ /* Called when the players have agreed on a draw */ },
		
		win: function( ){ /* Called when the player wins the game */ },
		
		//
		// Actions involving the other player
		//		
		acceptDraw: function( deferred ){ /* called when the other player offers a draw. Returns true to accept, false to reject */ },
		
		//
		// Game event handlers
		//
		turn: function( ){ console.log( "Player#turn" ); /* when this player recieves the turn */ },
		
		placed: function( ){ /* when a piece has been placed on the board */ },
		
		moved: function( ){ /* when any player has moved a piece */ },
		
		promotion: function( ){ /* when one of our pieces is being promoted */ },
		
		//
		// Handlers for events after something happend to the player
		//
		check: function( ){ /* Called when the other player checked you */ },
		
		mate: function( ){ /* Called when the other player mates you */ },
		
		staleMate: function( ){ /* Called when you are stale mated */ }
		
	});


	return chess.Player;
});