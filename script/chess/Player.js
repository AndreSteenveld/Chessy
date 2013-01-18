/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define( [ ".", "lib" ], function( chess, lib ){

	chess.Player = lib.declare( [ lib.Evented ], {
		
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
		onStarted: function( ){ /* when the game has started */ },
		
		onSurrender: function( ){ },
		
		onEnd: function( ){ /* called when the game comes to an end */ },
		
		onLose: function( ){ /* Called when the player loses */ },
		
		onDraw: function( ){ /* Called when the players have agreed on a draw */ },
		
		onWin: function( ){ /* Called when the player wins the game */ },
		
		//
		// Actions involving the other player
		//		
		acceptDraw: function( deferred ){ /* called when the other player offers a draw. Returns true to accept, false to reject */ },
		
		//
		// Game event handlers
		//
		onTurn: function( ){ /* when this player recieves the turn */ },
		
		onPlaced: function( ){ /* when a piece has been placed on the board */ },
		
		onMoved: function( ){ /* when any player has moved a piece */ },
		
		onPromotion: function( ){ /* when one of our pieces is being promoted */ },
		
		//
		// Handlers for events after something happend to the player
		//
		onCheck: function( ){ /* Called when the other player checked you */ },
		
		onCheckMate: function( ){ /* Called when the other player mates you */ },
		
		onStaleMate: function( ){ /* Called when you are stale mated */ }
		
	});


	return chess.Player;
});