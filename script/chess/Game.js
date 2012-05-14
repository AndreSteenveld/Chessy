/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define( [ ".", "lib" ], function( chess, lib ){
	
	chess.Game = lib.declare( [ lib.Evented ], {
		color: null,
		
		board: null,
		
		white: null,
		black: null,
		
		constructor: function( _game_ ){
			var board = this.board = _game_.board;
					
			lib.aspect.after( board, "place", this._onPlaced.bind( this ), true );
			
			Object.keys( board.fieldsByName ).forEach( 
				Function.bind( this, function( name ){
				
					var field = board.fieldsByName[ name ];				
					lib.aspect.around( field, "occupy", this._onMoved.bind( this, field ) );				
				
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
				
				this.color || this.turn( );			
				this.emit.onIdle( this, [ "Start", { color: this.color } ] );
				this[ this.color ].turn.onIdle( this[ this.color ] );
				
			} else {
				
				console.warn( "Game#start :: Not enough players to start the game" );
				
			}
		},
		
		end: function( conditions ){
			if( conditions.result === "check mate" ){
				this.emit.onIdle( this, [ "checkMate", {
					winner: conditions.winner,
					loser:  conditions.loser
				}]);
				
			} else if( conditions.result === "surrender" ){
				this.emit.onIdle( this, [ "surrender", {
					winner: conditions.winner,
					loser:  conditions.loser
				}]);
				
			} else if( conditions.result === "stale mate" ){
				this.emit.onIdle( this, [ "staleMate", {
					winner: conditions.winner,
					loser:  conditions.loser
				}]);
				
			} else if( conditions.result === "draw" ){
				this.emit.onIdle( this, [ "draw" ] );					
				
			}
			
			this.emit.onIdle( this, [ "end", { result: conditions.result } ] );			
		},
		
		//
		// Game events
		//
		onPlaced: function( _placed_ ){ },
		_onPlaced: function( field, piece ){ 
			this.emit.onIdle( this, [ "Placed", {
				field: field,
				piece: piece
			}]);
		},
		
		onMoved: function( _moved_ ){ 			
			// If we don't have players it can't be a move so lets ignore it..
			if( !this.white || !this.black ){ return; }
			
			var color = this.turn( );

			if( this.board.isStaleMate( color ) ){
			
				this[ this.color ].staleMates.onIdle( this[ this.color ] );
				this.emit.onIdle( this, [ "Draw" ] );				
				
			} else if( this.board.isCheckMate( color ) ){
				
				this[ color ].mates.onIdle( this[ color ] );
				this.emit.onIdle( this, [ "CheckMate", { color: color } ] );
							
			} else if( this.board.isCheck( color ) ){
				
				this[ color ].checked.onIdle( this[ color ] );
				this.emit.onIdle( this, [ "Check", { color: color } ] );
							
			} else {
				
				this[ color ].turn.onIdle( this[ color ] );
				
			}
		},
		_onMoved: function( field, occupy ){
			return Function.bind( this, function( piece ){
				piece.field && this.emit.onIdle( this, [ "Moved", {
					occupant: field.piece,
					piece:    piece,
					from:     piece.field,
					to:       field
				}]);
				
				return occupy.call( field, piece );					
			});			
		},
						
		onCheck: function( ){ },
		
		onStaleMate: function( ){ },
		
		onCheckMate: function( ){ },
		
		onSurrender: function( ){ },
						
		onStart: function( ){ },
		
		onDraw: function( ){ },
		
		onEnd: function( ){ },
		
		onPlayerJoin: function( ){ },
		
		onPlayerLeave: function( ){ },
		
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