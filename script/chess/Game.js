/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define( [ ".", "lib" ], function( chess, lib ){
	
	chess.Game = lib.declare( [ lib.Evented ], {
		counter: 0,
		
		color: null,
		
		board: null,
		
		white: null,
		black: null,
		
		constructor: function( _game_ ){
			var board = this.board = _game_.board;
					
			lib.aspect.after( board, "place", this._placeHandler.bind( this ), true );
			
			board.piecesInPlay.forEach( 
				Function.bind( this, function( piece ){
										
					lib.aspect.around( piece, "move", this._moveHandler.bind( this, piece ) );				
				
				})
			);
			
			"white" in _game_ && _game_.white.join( this, "white" );
			"black" in _game_ && _game_.black.join( this, "black" );			
			
			"color" in _game_ && ( this.color = _game_.color );
		},
		
		turn: function( ){ 
			return this.color && this.color === "white"
				? ( this.color = "black" )
				: ( this.color = "white" );	
		},
		
		start: function( ){
			if(
				   this.white && this.white.isInstanceOf( chess.Player )
				&& this.black && this.black.isInstanceOf( chess.Player )				
			){
				// Flip the color, hackish but effective
				!this.color || this.color === "white"
					? ( this.color = "white" )
					: ( this.color = "black" );
					
				this.emit.onIdle( this, [ "Start", { color: this.color } ] );
				
			} else {
				
				console.warn( "Game#start :: Not enough players to start the game" );
				
			}
		},
		
		end: function( conditions ){
			
			if( conditions.result === "Surrender" ){
				
				this.emit.onIdle( this, [ "Surrender", conditions ] );
									
			} 
			
		},
		
		draw: function( ){
			
			
		},
		
		//
		// Handlers for the place and occupy methods from the board
		//
		_placeHandler: function( field, piece ){ 
			this.emit.onIdle( this, [ "Placed", {
				field: field,
				piece: piece
			}]);
		},
		
		_moveHandler: function( piece, move ){
			
			return Function.bind( this, function( toField ){
				
				var occupant = toField.piece || null,
					field    = piece.field;
				
				if( move.call( piece, toField ) ){
					
					piece.field && this.emit.onIdle( this, [ "Moved", {
						counter:  this.counter++,
						color:    this.color,
						occupant: occupant,       // The current puece on the field
						piece:    piece,          // The piece we are moving
						from:     field,          // Where did the moving piece come from
						to:       toField         // Where are we going?
					}]);
					
					return true;
					
				} else {
				
					this.emit.onIdle( this, [ "IllegalMove", new Error( "Failed to move piece", { piece: piece, toField: toField } ) ] );
					return false;	 
					
				}			
				
			});
			
		},

		//
		// Game events
		//
		onPlaced: function( _placed_ ){ /* When a piece is placed on the board (setup or pawn promotion) */ },
				
		onMoved: function( _moved_ ){ 
			if( !this.white || !this.black ){ return; }
			
			var color = this.turn( ),
				turn  = color === "white" ? "black"     : "white",
				event = color === "white" ? "BlackTurn" : "WhiteTurn",
				data  = lib.mixin( { }, _moved_ );

			// 
			// We do want to make sure that the check event is triggered befire the
			// actual turn event. This is becuase a player has to know he is check
			// before considering any moves. Using the deferred returned from the 
			// onIdle will gurantee that.
			//
			if( !this.board.isCheck( turn ) && this.board.isStaleMate( turn ) ){
			
				return this.emit.onIdle( this, [ "StaleMate", data ] )
					.then( this.emit.async( this, [ "Draw", { result: "StaleMate" } ] ) )
					.then( this.emit.async( this, [ "End",  { result: "StaleMate" } ] ) );
			
			} else if( !this.board.isCheckMate( turn ) && this.board.isCheck( turn ) ){
			
				return this.emit.onIdle( this, [ "Check", data ] )
					.then( this.emit.async( this, [ event, data ] ) );
			
			} else if( this.board.isCheckMate( turn ) ){
				
				return this.emit.onIdle( this, [ "CheckMate", data ] )
					.then( 
						this.emit.async( this, 
							[ "End", 
								{ 
									result: "CheckMate", 
									
									winner: color,
									loser:  turn 
									
								}
							] 
						) 
						
					);
							
			} else {
						
				return this.emit.onIdle( this, [ event, data ]);
				
			}
				
		},
		
		onIllegalMove: function( _illegal_ ){ /* When a player makes an illegal move */ },
			
		onWhiteTurn: function( _turn_ ){ /* The white player recieved the turn */ },
		
		onBlackTurn: function( _turn_ ){ /* The black player recieced the turn */ },
						
		onCheck: function( _turn_ ){ /* Fired when any player is checked */ },
		
		onStaleMate: function( _result_ ){ /* Fired when there is a stale mate, fired before the onEnd event */ },
		
		onCheckMate: function( _result_ ){ /* Fired when eiter player is mated, fired before the onEnd event */ },
		
		onSurrender: function( _result_ ){ /* Fired when a player surrenders the match, fired before the onEnd event */ 
			
			this.emit.onIdle( this, [ "End", _result_ ] );
				
		},
						
		onStart: function( _start_ ){ 
				
			this.emit.onIdle( this, [ "Moved", 
				{ 
					counter: this.counter++,
					color:   _start_.color	
				}				
			]);	
			
		},
		
		onDraw: function( _result_ ){ /* Fired when a game ended in a draw, fired before the onEnd event */ },
		
		onEnd: function( _result_ ){ /* Fired when the game has eneded */ },
		
		onPlayerJoin: function( _newPlayer_ ){ /* When a player joins the game */},
		
		onPlayerLeave: function( ){ /* When a player leaves and the the game wasn't started */ },
		
		//
		// Actions
		//
		join: function( player, color ){ 
			// We already have 2 players, or the preferred color is already taken...
			if( ( color && this[ color ] ) || ( this.black && this.white ) ){ 
				return null; 	
			}
			
			// Decide what color we are going to use
			color || ( color = ~~( Math.random( ) * 10 ) % 2 ? "white" : "black" );
			this[ color ] = player;
						
			this.emit.onIdle( this, [ "PlayerJoin", { color: color, player: player } ] );
			
			return color;
		},
		
		leave: function( player ){ 
			this[ player.color ] = null;
			this.emit.onIdle( this, [ "PlayerLeave", { player: player } ] );
		}
	});

	return chess.Game;
});