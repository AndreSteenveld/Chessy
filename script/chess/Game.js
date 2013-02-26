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
			
			this.whiteEmitter = lib.delegate( this );
			this.blackEmitter = lib.delegate( this );
			
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
					
					var _moved_  = {
							counter:  this.counter++,
							color:    this.color,
							occupant: occupant,       // The current puece on the field
							piece:    piece,          // The piece we are moving
							from:     field,          // Where did the moving piece come from
							to:       toField         // Where are we going?
						};

					piece.type === "Pawn" && piece.y === 7
						? this.emit.onIdle( this, [ "Promotion", lib.delegate( _moved_, { color: piece.color } ) ] )
							.then( this.emit.async( this, [ "Moved", _moved_ ] ) )
						: this.emit.onIdle( this, [ "Moved", _moved_ ] );
										
					return true;
					
				} else {
				
					this.emit.onIdle( this, [ "IllegalMove", {
						counter: this.counter,
						piece: piece,
						color: this.color,
						from: field,
						to: toField						
					}]);
					
					return false;	 
					
				}			
				
			});
			
		},
		
		player: function( args, both, name ){
			
			var event  = name || args.callee.nom.slice( 2 ),
				player = !both && this[ args[ 0 ].color || args[ 0 ].loser ];
			
			return !both
				? player.emit.onIdle( player, [ event, args[ 0 ] ] )
				: lib.Deferred.all(
					this.white.emit.onIdle( this.white, [ event, args[ 0 ] ] ),
					this.black.emit.onIdle( this.black, [ event, args[ 0 ] ] )
				);
			
		},

		//
		// Game events
		//
		onPlaced: function( _placed_ ){ /* When a piece is placed on the board (setup or pawn promotion) */ 
			return this.player( arguments, true );	
		},
				
		onMoved: function( _moved_ ){ 
						
			var color = this.turn( ),
				turn  = color === "white" ? "black" : "white",
				data  = lib.mixin( { }, _moved_ );

			// 
			// We do want to make sure that the check event is triggered befire the
			// actual turn event. This is becuase a player has to know he is check
			// before considering any moves. Using the deferred returned from the 
			// onIdle will gurantee that.
			//
			if( !this.board.isCheck( turn ) && this.board.isStaleMate( turn ) ){
			
				return this.player( arguments, true )
					.then( this.emit.async( this, [ "StaleMate", { result: "StaleMate" } ] ) );
								
			} else if( !this.board.isCheckMate( turn ) && this.board.isCheck( turn ) ){
			
				return this.player( arguments, true )
					.then( this.emit.async( this, [ "Check", data ] ) )
					.then( this.emit.async( this, [ "Turn", data ] ) );
			
			} else if( this.board.isCheckMate( turn ) ){
					
				return this.player( arguments, true )
					.then( 
						this.emit.async( this, [ "CheckMate", 
							{ 
								result: "CheckMate", 
									
								winner: color,
								loser:  turn 
							}
						]) 
					);
							
			} else {
								
				return this.player( arguments, true )
					.then( this.emit.async( this, [ "Turn", data ]) );
				
			}
				
		},
		
		onIllegalMove: function( _illegal_ ){ /* When a player makes an illegal move */ 
			return this.player( arguments );	
		},
			
		onTurn: function( _turn_ ){ // The event that is triggered when te turn is passed to the other player
			return this.player( arguments );
		},
		
		onPromotion: function( _turn_ ){ // When a promotion has happended on the board
			return this.player( arguments );			
		},
						
		onCheck: function( _turn_ ){ /* Fired when any player is checked */ 
			return this.player( arguments );	
		},
		
		onStaleMate: function( _result_ ){ /* Fired when there is a stale mate, fired before the onEnd event */ 
			return this.player( arguments, true )
				.then( this.emit.async( this, [ "Draw", _result_ ] ) );	
		},
		
		onCheckMate: function( _result_ ){ /* Fired when eiter player is mated, fired before the onEnd event */ 
			return this.player( arguments )
				.then( this.emit.async( this, [ "End", _result_ ] ) );	
		},
		
		onSurrender: function( _result_ ){ /* Fired when a player surrenders the match, fired before the onEnd event */ 
			return this.player( arguments, true )
				.then( this.emit.async( this, [ "End", _result_ ] ) );
		},
						
		onStart: function( _start_ ){ 
			
			this.player( arguments, true )
				.then( 
					this.emit.async( this, 
						[
							"Moved", 
							{ 
								counter: this.counter++,
								color:   _start_.color	
							}				
						]
					)
				);	
			
		},
		
		onDraw: function( _result_ ){ /* Fired when a game ended in a draw, fired before the onEnd event */ 
			this.player( arguments, true )
				.then( this.emit.async( this, [ "End", _result_ ] ) );
		},
		
		onEnd: function( _result_ ){ /* Fired when the game has eneded */ 
						
			if( _result_.result === "Draw" || _result_.result === "StaleMate" ){
			
				return this.player( arguments, true );
				
			} else {
						
				var winner = this[ _result_.winner ],
					loser  = this[ _result_.loser ];
						
				return ( 
					lib.Deferred.all(
						winner.emit.onIdle( winner, [ "Win", _result_ ] ),
						loser.emit.onIdle( loser, [ "Lose", _result_ ] )
					)
				).then( this.player.async( this, [ arguments, true, "End" ] ) );
				
				// For reasons that are still unclear to me it seemt that it is not possible to
				// bind an arguments object with additional properties attached to it.
			
			}
			
		},
		
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