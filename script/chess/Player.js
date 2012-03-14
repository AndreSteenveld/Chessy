define( [ ".", "lib" ], function( chess, lib ){

	chess.Player = lib.declare( [ ], {
		
		_gameEvents: null,
		
		game: null,
		
		color: null,
		board: null,
		
		constructor: function( _player_ ){ 
			_player_.color && ( this.color = _player_.color );
			_player_.game && this.join( _player_.game );		
		},
		
		//
		// Actions involving the other player
		//			
		offerDraw: function( ){ },
		
		acceptDraw: function( ){ /* called when the other player offers a draw. Returns true to accept, false to reject */ },
			
		surrender: function( ){ 
			this.game.end({
				result: "surrender",
				loser: this,
				winner: this.color === "white" 
					? this.board.black
					: this.board.white				
			});
		},
		
		//
		// Game actions
		//
		lose: function( ){ /* Called when the player loses */ },
		
		draw: function( ){ /* Called when the players have agreed on a draw */ },
		
		win: function( ){ /* Called when the player wins the game */ },
		
		join: function( game, color ){ 
			if( ( this.color = game.join( this, this.color ) ) ){
				
				this.game  = game;
				this.board = game.board;
				
			}
			
			this._gameEvents = {
				//turn: function( ){ /* when this player recieves the turn */ },
		
				placed: this.game.on( "placed", this.placed.bind( this ) ),
				
				moved: this.game.on( "moved", this.moved.bind( this ) ),
				
				started: this.game.on( "start", this.started.bind( this ) ),
				
				ended: this.game.on( "end", this.ended.bind( this ) )
			};			
		},
		
		leave: function( ){ 
			Object.keys( this._gameEvents ).forEach( 
				Function.bind( this._gameEvents, function( key ){ this[ key ].remove( ); } )
			);
			
			this.game = null;
			this.board = null;
			
			this.game.leave( this );			
		},
		
		//
		// Game event handlers
		//
		turn: function( ){ /* when this player recieves the turn */ },
		
		placed: function( ){ /* when a piece has been placed on the board */ },
		
		moved: function( ){ /* when any player has moved a piece */ },
		
		started: function( ){ /* when the game has started */ },
		
		checked: function( ){ /* Called when the other player checked you */ },
		
		mates: function( ){ /* Called when the other player mates you */ },
		
		staleMates: function( ){ /* Called when you are stale mated */ },
		
		ended: function( ){ /* called when the game comes to an end */ }
	});


	return chess.Player;
});